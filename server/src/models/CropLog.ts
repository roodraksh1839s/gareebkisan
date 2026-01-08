import mongoose, { Document, Schema } from 'mongoose';

export interface ICropLog extends Document {
  userId: mongoose.Types.ObjectId;
  cropName: string;
  variety?: string;
  area: number;
  unit: 'acres' | 'hectares';
  plantingDate: Date;
  expectedHarvestDate?: Date;
  actualHarvestDate?: Date;
  status: 'planning' | 'planted' | 'growing' | 'harvested' | 'sold';
  activities: Array<{
    type: 'irrigation' | 'fertilizer' | 'pesticide' | 'weeding' | 'other';
    description: string;
    date: Date;
    cost?: number;
  }>;
  expenses: {
    seeds: number;
    fertilizers: number;
    pesticides: number;
    labor: number;
    irrigation: number;
    other: number;
    total: number;
  };
  yield?: {
    quantity: number;
    unit: string;
    quality?: string;
  };
  revenue?: number;
  notes?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const cropLogSchema = new Schema<ICropLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
    },
    variety: String,
    area: {
      type: Number,
      required: [true, 'Area is required'],
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares'],
      default: 'acres',
    },
    plantingDate: {
      type: Date,
      required: [true, 'Planting date is required'],
    },
    expectedHarvestDate: Date,
    actualHarvestDate: Date,
    status: {
      type: String,
      enum: ['planning', 'planted', 'growing', 'harvested', 'sold'],
      default: 'planning',
    },
    activities: [
      {
        type: {
          type: String,
          enum: ['irrigation', 'fertilizer', 'pesticide', 'weeding', 'other'],
          required: true,
        },
        description: String,
        date: {
          type: Date,
          default: Date.now,
        },
        cost: Number,
      },
    ],
    expenses: {
      seeds: { type: Number, default: 0 },
      fertilizers: { type: Number, default: 0 },
      pesticides: { type: Number, default: 0 },
      labor: { type: Number, default: 0 },
      irrigation: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    yield: {
      quantity: Number,
      unit: String,
      quality: String,
    },
    revenue: Number,
    notes: String,
    images: [String],
  },
  { timestamps: true }
);

// Calculate total expenses before saving
cropLogSchema.pre('save', function (next) {
  this.expenses.total =
    this.expenses.seeds +
    this.expenses.fertilizers +
    this.expenses.pesticides +
    this.expenses.labor +
    this.expenses.irrigation +
    this.expenses.other;
  next();
});

export default mongoose.model<ICropLog>('CropLog', cropLogSchema);
