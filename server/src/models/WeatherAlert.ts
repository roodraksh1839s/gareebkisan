import mongoose, { Document, Schema } from 'mongoose';

export interface IWeatherAlert extends Document {
  location: {
    state: string;
    district: string;
  };
  alertType: 'heavy-rain' | 'storm' | 'heatwave' | 'cold-wave' | 'drought' | 'flood' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  recommendations: string[];
  source: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const weatherAlertSchema = new Schema<IWeatherAlert>(
  {
    location: {
      state: { type: String, required: true },
      district: { type: String, required: true },
    },
    alertType: {
      type: String,
      enum: ['heavy-rain', 'storm', 'heatwave', 'cold-wave', 'drought', 'flood', 'other'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    recommendations: [String],
    source: {
      type: String,
      default: 'IMD',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for querying active alerts by location
weatherAlertSchema.index({ 'location.state': 1, 'location.district': 1, isActive: 1 });

export default mongoose.model<IWeatherAlert>('WeatherAlert', weatherAlertSchema);
