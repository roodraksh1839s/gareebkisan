import { Request, Response } from 'express';
import { body } from 'express-validator';
import MarketplaceListing from '../models/MarketplaceListing';
import { getPaginationParams, createPaginationResult } from '../utils/pagination';
import { AuthRequest } from '../middleware/auth';

export const createListingValidation = [
  body('productName').notEmpty().withMessage('Product name is required'),
  body('category').isIn(['crops', 'seeds', 'fertilizers', 'equipment', 'other']).withMessage('Invalid category'),
  body('description').notEmpty().withMessage('Description is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('unit').notEmpty().withMessage('Unit is required'),
  body('pricePerUnit').isNumeric().withMessage('Price per unit must be a number'),
];

export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = new MarketplaceListing({
      ...req.body,
      sellerId: req.user?._id,
    });

    await listing.save();

    res.status(201).json({
      message: 'Listing created successfully',
      listing,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, sort } = getPaginationParams(req);
    const { category, status, search, state, district } = req.query;

    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;
    else query.status = 'active'; // Default to active listings
    
    if (search) {
      query.$text = { $search: search as string };
    }
    
    if (state) query['location.state'] = state;
    if (district) query['location.district'] = district;

    const total = await MarketplaceListing.countDocuments(query);
    const listings = await MarketplaceListing.find(query)
      .populate('sellerId', 'name phone location')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(createPaginationResult(listings, total, page, limit));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id)
      .populate('sellerId', 'name phone email location');

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.json({ listing });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await MarketplaceListing.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!listing) {
      res.status(404).json({ error: 'Listing not found or unauthorized' });
      return;
    }

    res.json({
      message: 'Listing updated successfully',
      listing,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await MarketplaceListing.findOneAndDelete({
      _id: req.params.id,
      sellerId: req.user?._id,
    });

    if (!listing) {
      res.status(404).json({ error: 'Listing not found or unauthorized' });
      return;
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, sort } = getPaginationParams(req);
    const { status } = req.query;

    const query: any = { sellerId: req.user?._id };
    if (status) query.status = status;

    const total = await MarketplaceListing.countDocuments(query);
    const listings = await MarketplaceListing.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(createPaginationResult(listings, total, page, limit));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsInquired = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id);

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    listing.inquiries += 1;
    await listing.save();

    res.json({ message: 'Inquiry recorded successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
