import express from 'express';
import { createTransaction//, getTransaction, updateTransaction, deleteTransaction 
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/transactions', createTransaction);

export default router;
