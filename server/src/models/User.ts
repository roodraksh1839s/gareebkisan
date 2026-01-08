import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'farmer' | 'buyer' | 'admin';
  avatar?: string;
  location?: {
    state: string;
    district: string;
    village?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  farmDetails?: {
    totalArea: number;
    unit: 'acres' | 'hectares';
    soilType?: string;
    irrigationType?: string;
  };
  verified: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'admin'],
      default: 'farmer',
    },
    avatar: {
      type: String,
    },
    location: {
      state: String,
      district: String,
      village: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    farmDetails: {
      totalArea: Number,
      unit: {
        type: String,
        enum: ['acres', 'hectares'],
      },
      soilType: String,
      irrigationType: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
