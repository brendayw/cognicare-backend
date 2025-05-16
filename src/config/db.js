import { Pool } from 'pg';
import { readFileSync } from 'fs';

const supabaseSSLcert = readFileSync('./config/supabase.crt').toString();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true, 
    ca: supabaseSSLcert,
  },
});

export default pool;