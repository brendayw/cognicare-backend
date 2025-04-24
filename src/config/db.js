import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'cognicare',
  password: process.env.PG_PASSWORD || 'TuNuevaContraseña123',
  port: process.env.PG_PORT || 5432, 
});

export default pool;