import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunityPost extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: 'question' | 'discussion' | 'tip' | 'success-story' | 'help';
  tags: string[];
  images?: string[];
  likes: mongoose.Types.ObjectId[];
  comments: Array<{
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;
  views: number;
  status: 'active' | 'closed' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

const communityPostSchema = new Schema<ICommunityPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category: {
      type: String,
      enum: ['question', 'discussion', 'tip', 'success-story', 'help'],
      required: true,
    },
    tags: [String],
    images: [String],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'deleted'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Index for searching
communityPostSchema.index({ title: 'text', content: 'text', tags: 'text' });
communityPostSchema.index({ createdAt: -1 });

export default mongoose.model<ICommunityPost>('CommunityPost', communityPostSchema);
