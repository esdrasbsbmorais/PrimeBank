import pool from '../config/db.js';

// Função para criar um novo cartão
export const createCard = async (req, res) => {
  const { userId, cardNumber, spendingLimit, expiryDate, cardType, issueDate, blocked } = req.body;
  const query = 'INSERT INTO Cards (UserId, CardNumber, SpendingLimit, ExpiryDate, CardType, IssueDate, Blocked) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
  const values = [userId, cardNumber, spendingLimit, expiryDate, cardType, issueDate, blocked];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Implementação de outras funções de CRUD...
