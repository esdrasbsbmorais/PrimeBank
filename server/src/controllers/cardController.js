import pool from '../config/db.js';

const cardTypes = {
  basic: { name: 'Basic', limit: 500 },
  intermediate: { name: 'Intermediate', limit: 1000 },
  elite: { name: 'Elite', limit: 2000 }
};

export const createCard = async (req, res) => {
  const userId = req.user.userId;
  const { cardName } = req.body;

  const cardNumber = generateCardNumber();
  const spendingLimit = cardTypes.basic.limit;
  const issueDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 8);

  const formattedExpiryDate = `${expiryDate.getFullYear()}-${('0' + (expiryDate.getMonth() + 1)).slice(-2)}-01`;
  const formattedIssueDate = `${issueDate.getFullYear()}-${('0' + (issueDate.getMonth() + 1)).slice(-2)}-01`;

  const query = 'INSERT INTO Cards (UserId, CardNumber, SpendingLimit, ExpiryDate, CardType, IssueDate, Blocked) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
  const values = [userId, cardNumber, spendingLimit, formattedExpiryDate, cardTypes.basic.name, formattedIssueDate, false];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar cartão:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCards = async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query('SELECT * FROM Cards WHERE UserId = $1', [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao obter cartões:", error);
    res.status(500).json({ error: error.message });
  }
};

export const upgradeCard = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM Cards WHERE CardId = $1', [id]);
    const card = rows[0];

    if (!card) {
      return res.status(404).json({ message: 'Cartão não encontrado' });
    }

    let newCreditLimit;
    switch (card.cardtype) {
      case cardTypes.basic.name:
        newCreditLimit = cardTypes.intermediate.limit;
        break;
      case cardTypes.intermediate.name:
        newCreditLimit = cardTypes.elite.limit;
        break;
      default:
        return res.status(400).json({ message: 'O cartão já está no nível máximo' });
    }

    const updatedCard = await pool.query(
      'UPDATE Cards SET SpendingLimit = $1, CardType = $2 WHERE CardId = $3 RETURNING *',
      [newCreditLimit, newCreditLimit === cardTypes.elite.limit ? cardTypes.elite.name : cardTypes.intermediate.name, id]
    );

    res.status(200).json(updatedCard.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer upgrade do cartão', error });
  }
};

export const downgradeCard = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM Cards WHERE CardId = $1', [id]);
    const card = rows[0];

    if (!card) {
      return res.status(404).json({ message: 'Cartão não encontrado' });
    }

    let newCreditLimit;
    switch (card.cardtype) {
      case cardTypes.elite.name:
        newCreditLimit = cardTypes.intermediate.limit;
        break;
      case cardTypes.intermediate.name:
        newCreditLimit = cardTypes.basic.limit;
        break;
      default:
        return res.status(400).json({ message: 'O cartão já está no nível mais baixo' });
    }

    const updatedCard = await pool.query(
      'UPDATE Cards SET SpendingLimit = $1, CardType = $2 WHERE CardId = $3 RETURNING *',
      [newCreditLimit, newCreditLimit === cardTypes.basic.limit ? cardTypes.basic.name : cardTypes.intermediate.name, id]
    );

    res.status(200).json(updatedCard.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer downgrade do cartão', error });
  }
};

export const deleteCard = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM Cards WHERE CardId = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir cartão', error });
  }
};

const generateCardNumber = () => {
  let cardNumber = '';
  for (let i = 0; i < 13; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }
  return `${cardNumber.slice(0, 4)} ${cardNumber.slice(4, 9)} ${cardNumber.slice(9, 13)}`;
};