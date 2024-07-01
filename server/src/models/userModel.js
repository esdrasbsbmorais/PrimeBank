import pool from '../config/db.js';

export const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Usuario (
      UsuarioID SERIAL PRIMARY KEY,
      Nome VARCHAR(255),
      Email VARCHAR(255),
      Senha VARCHAR(255),
      DataNascimento DATE,
      Telefone VARCHAR(20)
    );
  `;
  await pool.query(query);
};

// Implementação de outras funções de CRUD (Create, Read, Update, Delete)...
