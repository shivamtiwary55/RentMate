import express from 'express';
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing
} from '../controllers/listing.controller.js';
import { protectRoute, authorizeRole } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getListings);
router.get('/:id', getListingById);
router.post('/', protectRoute, authorizeRole('landlord', 'admin'), upload.array('images', 5), createListing);
router.put('/:id', protectRoute, authorizeRole('landlord', 'admin'), updateListing);
router.delete('/:id', protectRoute, authorizeRole('landlord', 'admin'), deleteListing);

export default router;