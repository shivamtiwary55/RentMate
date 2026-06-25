import express from 'express';
import { createComplaint, getComplaints, updateComplaintStatus } from '../controllers/complaint.controller.js';
import { protectRoute, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectRoute, authorizeRole('student'), createComplaint);
router.get('/', protectRoute, getComplaints);
router.patch('/:id/status', protectRoute, authorizeRole('landlord'), updateComplaintStatus);

export default router;