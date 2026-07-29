import { Pool } from "pg";

console.log('DATABASE_URL =', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function dbExecute(
  query: string,
  params: unknown[] = []
): Promise<any[]> {
  console.log('\n========== SQL ==========');
  console.log(query);
  console.log(params);

  const client = await pool.connect();

  try {
    console.log('Executing SQL:');
    console.log(query);
    console.log('Params:', params);

    const result = await client.query(query, params);

    console.log('Rows:', result.rows);

    return result.rows;
  } catch (err) {
    console.error('========== POSTGRES ERROR ==========');
    console.dir(err, { depth: null });
    console.error('====================================');
    throw err;
  } finally {
    client.release();
  }
}

export async function dbLastInsertId(): Promise<number> {
  throw new Error(
    "dbLastInsertId() is not supported in PostgreSQL. Use INSERT ... RETURNING instead."
  );
}