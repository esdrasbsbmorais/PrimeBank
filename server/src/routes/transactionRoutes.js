import express from 'express';
import { createTransaction, findUserByCardNumber, getTransferHistory } from '../controllers/transactionController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/transactions', authenticateToken, createTransaction);
router.get('/findUserByCard/:cardNumber', authenticateToken, findUserByCardNumber);
router.get('/getTransfers', authenticateToken, getTransferHistory);

export default router;
