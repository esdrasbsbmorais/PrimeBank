import express from 'express';
import { createCard, getCards, upgradeCard, downgradeCard, deleteCard } from '../controllers/cardController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createCard', authenticateToken, createCard);
router.get('/getCards', authenticateToken, getCards);
router.put('/upgradeCard/:id', authenticateToken, upgradeCard);
router.put('/downgradeCard/:id', authenticateToken, downgradeCard);
router.delete('/deleteCard/:id', authenticateToken, deleteCard);

export default router;