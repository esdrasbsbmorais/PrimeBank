import express from 'express';
import { registerUser, loginUser } from '../controllers/userControllers.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Rota protegida
router.get('/protected', authenticateToken, (req, res) => {
  res.send({ message: "Conteúdo protegido acessado com sucesso!" });
});

export default router;
