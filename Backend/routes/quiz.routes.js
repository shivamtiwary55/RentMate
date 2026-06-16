import express from 'express';
import { submitQuiz, getMatches } from '../controllers/quiz.controller.js';
import { protectRoute, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectRoute, authorizeRole('student'), submitQuiz);
router.get('/matches', protectRoute, authorizeRole('student'), getMatches);

export default router;