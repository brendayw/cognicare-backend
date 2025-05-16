import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres.ymhkwapfyhyscbvzbedl:R6mu6ucnIcrpFmVj@aws-0-sa-east-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;