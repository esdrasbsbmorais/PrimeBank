import pool from '../config/db.js';

// Função para criar uma nova transação
export const createTransaction = async (req, res) => {
  const { sourceUserId, destinationUserId, amount } = req.body;
  const date = new Date();
  const description = "Transferência";

  const query = 'INSERT INTO Transactions (SourceUserId, DestinationUserId, Amount, Date, Description) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [sourceUserId, destinationUserId, amount, date, description];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Função para encontrar usuário pelo número do cartão
export const findUserByCardNumber = async (req, res) => {
  const { cardNumber } = req.params;

  try {
    const result = await pool.query(
      'SELECT Users.id, Users.name FROM Cards JOIN Users ON Cards.UserId = Users.id WHERE Cards.CardNumber = $1',
      [cardNumber]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Função para obter o histórico de transferências
export const getTransferHistory = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT Transactions.*, Users.name as destinationUserName FROM Transactions JOIN Users ON Transactions.DestinationUserId = Users.id WHERE SourceUserId = $1',
      [req.user.userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ error: error.message });
  }
};
