import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Verifica se o pool foi configurado corretamente
pool.connect()
  .then(() => {
    console.log('Pool de conexões configurado corretamente.');
  })
  .catch(err => {
    console.error('Erro ao conectar ao PostgreSQL:', err.message);
  });

export default pool;
