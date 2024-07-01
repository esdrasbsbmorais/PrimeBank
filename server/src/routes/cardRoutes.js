import express from 'express';
import { createCard//, getCard, updateCard, deleteCard 
    
} from '../controllers/cardController.js';

const router = express.Router();

router.post('/cards', createCard);

export default router;
