import express from 'express';
import { login, register } from '../controllers/auth.js';
import { createPost } from '../controllers/posts.js';

const router = express.Router();
router.post('/login', login);
router.post('/register', register);

export default router;
