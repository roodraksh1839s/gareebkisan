import { Router } from 'express';
import {
  updateProfile,
  changePassword,
  deleteAccount,
  getSettings,
  updateProfileValidation,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate); // All routes require authentication

router.get('/', getSettings);
router.put('/profile', validate(updateProfileValidation), updateProfile);
router.put('/password', changePassword);
router.delete('/account', deleteAccount);

export default router;
