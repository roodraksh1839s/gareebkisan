import { Response } from 'express';
import { body } from 'express-validator';
import CropLog from '../models/CropLog';
import { getPaginationParams, createPaginationResult } from '../utils/pagination';
import { AuthRequest } from '../middleware/auth';

export const createCropLogValidation = [
  body('cropName').notEmpty().withMessage('Crop name is required'),
  body('area').isNumeric().withMessage('Area must be a number'),
  body('plantingDate').isISO8601().withMessage('Valid planting date is required'),
];

export const createCropLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cropLog = new CropLog({
      ...req.body,
      userId: req.user?._id,
    });

    await cropLog.save();

    res.status(201).json({
      message: 'Crop log created successfully',
      cropLog,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCropLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, sort } = getPaginationParams(req);
    const { status, cropName } = req.query;

    const query: any = { userId: req.user?._id };
    if (status) query.status = status;
    if (cropName) query.cropName = new RegExp(cropName as string, 'i');

    const total = await CropLog.countDocuments(query);
    const cropLogs = await CropLog.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(createPaginationResult(cropLogs, total, page, limit));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCropLogById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cropLog = await CropLog.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    });

    if (!cropLog) {
      res.status(404).json({ error: 'Crop log not found' });
      return;
    }

    res.json({ cropLog });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCropLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cropLog = await CropLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!cropLog) {
      res.status(404).json({ error: 'Crop log not found' });
      return;
    }

    res.json({
      message: 'Crop log updated successfully',
      cropLog,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCropLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cropLog = await CropLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id,
    });

    if (!cropLog) {
      res.status(404).json({ error: 'Crop log not found' });
      return;
    }

    res.json({ message: 'Crop log deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cropLog = await CropLog.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    });

    if (!cropLog) {
      res.status(404).json({ error: 'Crop log not found' });
      return;
    }

    cropLog.activities.push(req.body);
    await cropLog.save();

    res.json({
      message: 'Activity added successfully',
      cropLog,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const totalLogs = await CropLog.countDocuments({ userId });
    const activeLogs = await CropLog.countDocuments({ userId, status: { $in: ['planted', 'growing'] } });
    const harvestedLogs = await CropLog.countDocuments({ userId, status: 'harvested' });

    const expenseStats = await CropLog.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$expenses.total' },
          totalRevenue: { $sum: '$revenue' },
        },
      },
    ]);

    res.json({
      statistics: {
        totalLogs,
        activeLogs,
        harvestedLogs,
        totalExpenses: expenseStats[0]?.totalExpenses || 0,
        totalRevenue: expenseStats[0]?.totalRevenue || 0,
        profit: (expenseStats[0]?.totalRevenue || 0) - (expenseStats[0]?.totalExpenses || 0),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
