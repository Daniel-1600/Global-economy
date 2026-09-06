import { Pool } from "pg";
  import "dotenv/config";

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  pool.query("SELECT NOW()")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("Database connection failed:", err.message));

  export default pool;
