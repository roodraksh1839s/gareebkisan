import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketplaceListing extends Document {
  sellerId: mongoose.Types.ObjectId;
  productName: string;
  category: 'crops' | 'seeds' | 'fertilizers' | 'equipment' | 'other';
  description: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  images: string[];
  location: {
    state: string;
    district: string;
    village?: string;
  };
  quality?: string;
  harvestDate?: Date;
  availableFrom: Date;
  availableUntil?: Date;
  status: 'active' | 'sold' | 'expired' | 'cancelled';
  views: number;
  inquiries: number;
  createdAt: Date;
  updatedAt: Date;
}

const marketplaceListingSchema = new Schema<IMarketplaceListing>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
    },
    category: {
      type: String,
      enum: ['crops', 'seeds', 'fertilizers', 'equipment', 'other'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    images: [String],
    location: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      village: String,
    },
    quality: String,
    harvestDate: Date,
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    availableUntil: Date,
    status: {
      type: String,
      enum: ['active', 'sold', 'expired', 'cancelled'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate total price before saving
marketplaceListingSchema.pre('save', function (next) {
  this.totalPrice = this.quantity * this.pricePerUnit;
  next();
});

// Index for searching
marketplaceListingSchema.index({ productName: 'text', description: 'text' });
marketplaceListingSchema.index({ status: 1, availableFrom: -1 });

export default mongoose.model<IMarketplaceListing>(
  'MarketplaceListing',
  marketplaceListingSchema
);
