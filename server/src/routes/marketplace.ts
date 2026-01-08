import { Router } from 'express';
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getMyListings,
  markAsInquired,
  createListingValidation,
} from '../controllers/marketplaceController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', optionalAuth, getListings);
router.get('/my-listings', authenticate, getMyListings);
router.get('/:id', optionalAuth, getListingById);
router.post('/', authenticate, validate(createListingValidation), createListing);
router.put('/:id', authenticate, updateListing);
router.delete('/:id', authenticate, deleteListing);
router.post('/:id/inquire', authenticate, markAsInquired);

export default router;
