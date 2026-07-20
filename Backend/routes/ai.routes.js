import express from 'express';
import { chatWithAI } from '../controllers/ai.controller.js';

const router = express.Router();

// protectRoute temporarily remove karo
router.post('/chat', chatWithAI);

export default router;