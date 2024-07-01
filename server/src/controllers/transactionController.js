import pool from '../config/db.js';

// Função para criar uma nova transação
export const createTransaction = async (req, res) => {
  const { sourceUserId, destinationUserId, amount, date, description } = req.body;
  const query = 'INSERT INTO Transactions (SourceUserId, DestinationUserId, Amount, Date, Description) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [sourceUserId, destinationUserId, amount, date, description];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Implementação de outras funções de CRUD...
