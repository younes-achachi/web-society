import express from 'express';
import { getFeedPosts, getUserPosts, likePost, createPost } from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
//  READ
router.post('/', verifyToken, createPost);
router.get(
	'/',
	(req, res, next) => {
		console.log('get  post postFired');
		next();
	},
	verifyToken,
	getFeedPosts
);
router.get(
	'/:userId/posts',
	(req, res, next) => {
		console.log(' post + UserId Fired');
		next();
	},
	verifyToken,
	getUserPosts
);
// UPDATE

router.patch('/:id/like', verifyToken, likePost);
export default router;
