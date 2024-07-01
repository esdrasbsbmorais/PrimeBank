import pool from '../config/db.js';

export const createTransactionTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Transacao (
      TransacaoID SERIAL PRIMARY KEY,
      OrigemUsuarioID INT REFERENCES Usuario(UsuarioID),
      DestinoUsuarioID INT REFERENCES Usuario(UsuarioID),
      Valor DECIMAL,
      Data TIMESTAMP,
      Descricao VARCHAR(255)
    );
  `;
  await pool.query(query);
};

// Implementação de outras funções de CRUD...
