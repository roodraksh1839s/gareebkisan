import mongoose, { Document, Schema } from 'mongoose';

export interface IScheme extends Document {
  name: string;
  nameHindi?: string;
  description: string;
  descriptionHindi?: string;
  category: 'subsidy' | 'loan' | 'insurance' | 'training' | 'equipment' | 'other';
  eligibility: string[];
  benefits: string[];
  applicationProcess: string[];
  documents: string[];
  officialWebsite?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  state?: string;
  district?: string;
  targetAudience: string[];
  budget?: number;
  deadline?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schemeSchema = new Schema<IScheme>(
  {
    name: {
      type: String,
      required: [true, 'Scheme name is required'],
    },
    nameHindi: String,
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    descriptionHindi: String,
    category: {
      type: String,
      enum: ['subsidy', 'loan', 'insurance', 'training', 'equipment', 'other'],
      required: true,
    },
    eligibility: [String],
    benefits: [String],
    applicationProcess: [String],
    documents: [String],
    officialWebsite: String,
    contactInfo: {
      phone: String,
      email: String,
      address: String,
    },
    state: String,
    district: String,
    targetAudience: [String],
    budget: Number,
    deadline: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for searching
schemeSchema.index({ name: 'text', description: 'text', category: 1 });

export default mongoose.model<IScheme>('Scheme', schemeSchema);
