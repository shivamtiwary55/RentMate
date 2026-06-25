import express from 'express';
import { createExpense, getExpenses, markAsPaid, getBalances } from '../controllers/expense.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectRoute, createExpense);
router.get('/:listingId', protectRoute, getExpenses);
router.get('/:listingId/balances', protectRoute, getBalances);
router.patch('/:id/pay', protectRoute, markAsPaid);

export default router;