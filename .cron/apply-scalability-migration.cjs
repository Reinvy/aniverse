/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Apply the add_scalability_filter_indexes migration to the remote DB and
 * record it in _prisma_migrations so future `prisma migrate deploy` runs
 * stay consistent. Reads DATABASE_URL from /tmp/aniverse-db-url.txt to
 * avoid putting the connection string on a command line.
 */
const fs = require("fs");
const crypto = require("crypto");
const { Client } = require("pg");

const DB_URL = fs.readFileSync("/tmp/aniverse-db-url.txt", "utf8").trim();
const MIGRATION_NAME = "20260813020000_add_scalability_filter_indexes";
const SQL_PATH = `prisma/migrations/${MIGRATION_NAME}/migration.sql`;

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
      console.log(`Migration ${MIGRATION_NAME} already recorded — skipping.`);
      return;
    }

    // 2. Apply the SQL
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
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

    // 4. Verify indexes exist
    const verify = await client.query(
      `SELECT indexname FROM pg_indexes
       WHERE indexname IN ('Artwork_isPublic_style_createdAt_idx', 'BlogArticle_isPublished_title_idx')
       ORDER BY indexname`,
    );
    console.log("Verified indexes:", JSON.stringify(verify.rows));
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
