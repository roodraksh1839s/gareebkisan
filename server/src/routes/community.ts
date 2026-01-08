import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
  getMyPosts,
  createPostValidation,
} from '../controllers/communityController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', optionalAuth, getPosts);
router.get('/my-posts', authenticate, getMyPosts);
router.get('/:id', optionalAuth, getPostById);
router.post('/', authenticate, validate(createPostValidation), createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);
router.post('/:id/like', authenticate, likePost);
router.post('/:id/comments', authenticate, addComment);

export default router;
