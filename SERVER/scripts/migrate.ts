import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run database migrations");
}

const migrationsDirectory = path.resolve(process.cwd(), "migrations");
const client = new Client({ connectionString });

try {
  await client.connect();
  await client.query("SELECT pg_advisory_lock(hashtext('global_economy_migrations'))");

  const migrationFiles = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const migrationFile of migrationFiles) {
    const migration = await readFile(
      path.join(migrationsDirectory, migrationFile),
      "utf8"
    );

    console.log(`Applying migration: ${migrationFile}`);
    await client.query(migration);
  }

  console.log(`Applied ${migrationFiles.length} database migrations`);
} finally {
  if (client) {
    await client
      .query("SELECT pg_advisory_unlock(hashtext('global_economy_migrations'))")
      .catch(() => undefined);
    await client.end().catch(() => undefined);
  }
}
