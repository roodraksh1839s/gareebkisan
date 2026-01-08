import { Router } from 'express';
import {
  getSchemes,
  getSchemeById,
  createScheme,
  getWeatherAlerts,
  getWeatherAlertById,
  createWeatherAlert,
  getUserAlerts,
} from '../controllers/schemeController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Schemes routes
router.get('/schemes', getSchemes);
router.get('/schemes/:id', getSchemeById);
router.post('/schemes', authenticate, authorize('admin'), createScheme);

// Weather alerts routes
router.get('/weather-alerts', getWeatherAlerts);
router.get('/weather-alerts/my-alerts', authenticate, getUserAlerts);
router.get('/weather-alerts/:id', getWeatherAlertById);
router.post('/weather-alerts', authenticate, authorize('admin'), createWeatherAlert);

export default router;
