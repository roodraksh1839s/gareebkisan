import { Request, Response } from 'express';
import { body } from 'express-validator';
import CommunityPost from '../models/CommunityPost';
import { getPaginationParams, createPaginationResult } from '../utils/pagination';
import { AuthRequest } from '../middleware/auth';

export const createPostValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').isIn(['question', 'discussion', 'tip', 'success-story', 'help']).withMessage('Invalid category'),
];

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = new CommunityPost({
      ...req.body,
      userId: req.user?._id,
    });

    await post.save();

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('userId', 'name avatar');

    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, sort } = getPaginationParams(req);
    const { category, search, tag } = req.query;

    const query: any = { status: 'active' };
    
    if (category) query.category = category;
    if (search) query.$text = { $search: search as string };
    if (tag) query.tags = tag;

    const total = await CommunityPost.countDocuments(query);
    const posts = await CommunityPost.find(query)
      .populate('userId', 'name avatar location')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-comments'); // Exclude comments from list view

    res.json(createPaginationResult(posts, total, page, limit));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('userId', 'name avatar location')
      .populate('comments.userId', 'name avatar')
      .populate('likes', 'name avatar');

    if (!post || post.status === 'deleted') {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({ post });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, tags, category } = req.body;

    const post = await CommunityPost.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      { title, content, tags, category },
      { new: true, runValidators: true }
    );

    if (!post) {
      res.status(404).json({ error: 'Post not found or unauthorized' });
      return;
    }

    res.json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await CommunityPost.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      { status: 'deleted' },
      { new: true }
    );

    if (!post) {
      res.status(404).json({ error: 'Post not found or unauthorized' });
      return;
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const userId = req.user?._id;
    const likeIndex = post.likes.findIndex(id => id.toString() === userId?.toString());

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId!);
    }

    await post.save();

    res.json({
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      likes: post.likes.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      res.status(400).json({ error: 'Comment content is required' });
      return;
    }

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    post.comments.push({
      userId: req.user?._id!,
      content: content.trim(),
      createdAt: new Date(),
    });

    await post.save();

    const updatedPost = await CommunityPost.findById(post._id)
      .populate('comments.userId', 'name avatar');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: updatedPost!.comments[updatedPost!.comments.length - 1],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, sort } = getPaginationParams(req);

    const query = { userId: req.user?._id, status: { $ne: 'deleted' } };

    const total = await CommunityPost.countDocuments(query);
    const posts = await CommunityPost.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(createPaginationResult(posts, total, page, limit));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
