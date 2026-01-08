import { Router } from 'express';
import {
  createCropLog,
  getCropLogs,
  getCropLogById,
  updateCropLog,
  deleteCropLog,
  addActivity,
  getStatistics,
  createCropLogValidation,
} from '../controllers/cropController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate); // All routes require authentication

router.post('/', validate(createCropLogValidation), createCropLog);
router.get('/', getCropLogs);
router.get('/statistics', getStatistics);
router.get('/:id', getCropLogById);
router.put('/:id', updateCropLog);
router.delete('/:id', deleteCropLog);
router.post('/:id/activities', addActivity);

export default router;
