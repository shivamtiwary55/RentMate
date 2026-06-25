import express from 'express';
import {
  getAnalytics,
  getAllUsers,
  toggleBanUser,
  getAllListings,
  adminDeleteListing,
  getAllComplaints
} from '../controllers/admin.controller.js';
import { protectRoute, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes are protected — admin only
router.use(protectRoute, authorizeRole('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.patch('/users/:id/ban', toggleBanUser);
router.get('/listings', getAllListings);
router.delete('/listings/:id', adminDeleteListing);
router.get('/complaints', getAllComplaints);

export default router;