/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Apply the add_search_trgm_indexes migration to the remote DB and record
 * it in _prisma_migrations so future `prisma migrate deploy` runs stay
 * consistent. Reads DATABASE_URL from /tmp/aniverse-db-url.txt to avoid
 * putting the connection string on a command line.
 *
 * Idempotent: re-running after a successful apply is a no-op (the migration
 * is already recorded in _prisma_migrations). CREATE EXTENSION IF NOT EXISTS
 * and CREATE INDEX (non-IF-NOT-EXISTS) are safe under the recorded guard —
 * the SQL only runs once, when the migration is first applied.
 */
const fs = require("fs");
const crypto = require("crypto");
const { Client } = require("pg");

const DB_URL = fs.readFileSync("/tmp/aniverse-db-url.txt", "utf8").trim();
const MIGRATION_NAME = "20260816020000_add_search_trgm_indexes";
const SQL_PATH = `prisma/migrations/${MIGRATION_NAME}/migration.sql`;

// All 11 trigram GIN indexes created by this migration — used to verify the
// apply actually landed on the remote DB.
const EXPECTED_INDEXES = [
  "Artwork_title_trgm_idx",
  "Artwork_prompt_trgm_idx",
  "Character_name_trgm_idx",
  "Character_personality_trgm_idx",
  "BlogArticle_title_trgm_idx",
  "BlogArticle_excerpt_trgm_idx",
  "User_name_trgm_idx",
  "User_username_trgm_idx",
  "User_email_trgm_idx",
  "Product_name_trgm_idx",
  "Product_description_trgm_idx",
];

async function main() {
  const sql = fs.readFileSync(SQL_PATH, "utf8");
  const checksum = crypto.createHash("sha256").update(sql).digest("hex");

  const client = new Client({ connectionString: DB_URL, ssl: false });
  await client.connect();

  try {
    // 1. Check if already recorded (idempotent re-run)
    const existing = await client.query(
      "SELECT 1 FROM _prisma_migrations WHERE migration_name = $1",
      [MIGRATION_NAME],
    );
    if (existing.rowCount > 0) {
      console.log(`Migration ${MIGRATION_NAME} already recorded — verifying indexes.`);
    } else {
      // 2. Apply the SQL (single implicit transaction)
      await client.query(sql);
      console.log("SQL applied.");

      // 3. Record in _prisma_migrations
      const id = crypto.randomUUID();
      const now = new Date();
      await client.query(
        `INSERT INTO _prisma_migrations
           (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
         VALUES ($1, $2, $3, $4, NULL, NULL, $3, 1)`,
        [id, checksum, now, MIGRATION_NAME],
      );
      console.log(`Recorded migration ${MIGRATION_NAME} (checksum ${checksum.slice(0, 12)}…).`);
    }

    // 4. Verify indexes exist
    const verify = await client.query(
      `SELECT indexname FROM pg_indexes
       WHERE indexname = ANY($1)
       ORDER BY indexname`,
      [EXPECTED_INDEXES],
    );
    const found = verify.rows.map((r) => r.indexname);
    const missing = EXPECTED_INDEXES.filter((idx) => !found.includes(idx));
    console.log(`Verified ${found.length}/${EXPECTED_INDEXES.length} indexes.`);
    if (missing.length > 0) {
      console.error("Missing indexes:", missing.join(", "));
      process.exitCode = 1;
    } else {
      console.log("All indexes present:", JSON.stringify(found));
    }

    // 5. Confirm the pg_trgm extension is installed
    const ext = await client.query(
      "SELECT extname, extversion FROM pg_extension WHERE extname = 'pg_trgm'",
    );
    console.log("pg_trgm extension:", JSON.stringify(ext.rows[0] ?? null));
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
