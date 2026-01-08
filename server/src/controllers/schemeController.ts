import { Request, Response } from 'express';
import Scheme from '../models/Scheme';
import WeatherAlert from '../models/WeatherAlert';
import { getPaginationParams, createPaginationResult } from '../utils/pagination';
import { AuthRequest } from '../middleware/auth';

// Schemes Controller
export const getSchemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, sort } = getPaginationParams(req);
    const { category, state, district, search } = req.query;

    const query: any = { isActive: true };
    
    if (category) query.category = category;
    if (state) query.state = state;
    if (district) query.district = district;
    if (search) query.$text = { $search: search as string };

    const total = await Scheme.countDocuments(query);
    const schemes = await Scheme.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(createPaginationResult(schemes, total, page, limit));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSchemeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme || !scheme.isActive) {
      res.status(404).json({ error: 'Scheme not found' });
      return;
    }

    res.json({ scheme });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createScheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const scheme = new Scheme(req.body);
    await scheme.save();

    res.status(201).json({
      message: 'Scheme created successfully',
      scheme,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Weather Alerts Controller
export const getWeatherAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, sort } = getPaginationParams(req);
    const { state, district, alertType, severity } = req.query;

    const query: any = { 
      isActive: true,
      endDate: { $gte: new Date() } // Only active and not expired alerts
    };
    
    if (state) query['location.state'] = state;
    if (district) query['location.district'] = district;
    if (alertType) query.alertType = alertType;
    if (severity) query.severity = severity;

    const total = await WeatherAlert.countDocuments(query);
    const alerts = await WeatherAlert.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(createPaginationResult(alerts, total, page, limit));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getWeatherAlertById = async (req: Request, res: Response): Promise<void> => {
  try {
    const alert = await WeatherAlert.findById(req.params.id);

    if (!alert) {
      res.status(404).json({ error: 'Weather alert not found' });
      return;
    }

    res.json({ alert });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createWeatherAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const alert = new WeatherAlert(req.body);
    await alert.save();

    res.status(201).json({
      message: 'Weather alert created successfully',
      alert,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userLocation = req.user?.location;

    if (!userLocation?.state) {
      res.status(400).json({ error: 'User location not set' });
      return;
    }

    const query: any = {
      isActive: true,
      endDate: { $gte: new Date() },
      'location.state': userLocation.state,
    };

    if (userLocation.district) {
      query['location.district'] = userLocation.district;
    }

    const alerts = await WeatherAlert.find(query)
      .sort({ severity: -1, startDate: -1 })
      .limit(10);

    res.json({ alerts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
