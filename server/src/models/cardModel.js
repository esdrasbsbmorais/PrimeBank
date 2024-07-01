import pool from '../config/db.js';

export const createCardTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Cartao (
      CartaoID SERIAL PRIMARY KEY,
      UsuarioID INT REFERENCES Usuario(UsuarioID),
      NumeroCartao VARCHAR(255),
      LimiteGasto DECIMAL,
      DataValidade DATE,
      TipoCartao VARCHAR(50),
      DataEmissao DATE,
      Bloqueado BOOLEAN
    );
  `;
  await pool.query(query);
};

// Implementação de outras funções de CRUD...
