import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Criar cartão
router.post("/createCard", authenticateToken, async (req, res) => {
  const { userId, cardName } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Cartao (user_id, card_name, balance, credit_limit) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, cardName, 0, 500]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar cartão", error });
  }
});

// Obter todos os cartões do usuário
router.get("/getCards", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  try {
    const result = await pool.query("SELECT * FROM Cartao WHERE user_id = $1", [userId]);
    if (result.rows.length === 0) {
      res.status(200).json([]); // Retorna um array vazio se não houver cartões
    } else {
      res.status(200).json(result.rows);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter cartões", error });
  }
});

// Atualizar cartão (upgrade)
router.put("/upgradeCard/:cardId", authenticateToken, async (req, res) => {
  const { cardId } = req.params;
  const { newCreditLimit } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Cartao SET credit_limit = $1 WHERE id = $2 RETURNING *",
      [newCreditLimit, cardId]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer upgrade do cartão", error });
  }
});

// Excluir cartão
router.delete("/deleteCard/:cardId", authenticateToken, async (req, res) => {
  const { cardId } = req.params;
  try {
    await pool.query("DELETE FROM Cartao WHERE id = $1", [cardId]);
    res.status(200).json({ message: "Cartão excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir cartão", error });
  }
});

export default router;
