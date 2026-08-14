/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Apply the add_scalability_social_indexes migration to the remote DB and
 * record it in _prisma_migrations so future `prisma migrate deploy` runs
 * stay consistent. Reads DATABASE_URL from /tmp/aniverse-db-url.txt to
 * avoid putting the connection string on a command line.
 *
 * Idempotent: re-running after a successful apply is a no-op (the migration
 * is already recorded in _prisma_migrations).
 */
const fs = require("fs");
const crypto = require("crypto");
const { Client } = require("pg");

const DB_URL = fs.readFileSync("/tmp/aniverse-db-url.txt", "utf8").trim();
const MIGRATION_NAME = "20260814020000_add_scalability_social_indexes";
const SQL_PATH = `prisma/migrations/${MIGRATION_NAME}/migration.sql`;

// All 11 composite indexes created by this migration — used to verify the
// apply actually landed on the remote DB.
const EXPECTED_INDEXES = [
  "Comment_targetType_targetId_createdAt_idx",
  "Comment_authorId_createdAt_idx",
  "Like_targetType_targetId_createdAt_idx",
  "Order_buyerId_createdAt_idx",
  "Order_status_createdAt_idx",
  "Transaction_userId_createdAt_idx",
  "Transaction_type_createdAt_idx",
  "SocialMediaPost_status_scheduledAt_idx",
  "ChallengeSubmission_challengeId_status_idx",
  "AnalyticsEvent_event_createdAt_idx",
  "AnalyticsEvent_category_createdAt_idx",
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
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
