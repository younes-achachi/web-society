import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import mongo from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import multer from 'multer';
import fs from 'fs';
import joy from 'joy';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { users, posts } from './data/index.js';
import User from './models/User.js';
import Post from './models/Post.js';
/* CONFIGURTIONS */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('the dir name ', __dirname, 'the Path ', __filename);
dotenv.config();
const formdata = multer().array();
const listingPath = path.join(__dirname, 'public');

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(helmet());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/dir', (req, res) => {
	// Build the path of the file using the URL pathname of the request.
	const filePath = path.join(listingPath, req.path);

	// If the path does not exist, return a 404.
	if (!fs.existsSync(filePath)) {
		return res.status(404).end();
	}

	// Check if the existing item is a directory or a file.
	if (fs.statSync(filePath).isDirectory()) {
		const filesInDir = fs.readdirSync(filePath);
		// If the item is a directory: show all the items inside that directory.
		return res.send(filesInDir);
	} else {
		const fileContent = fs.readFileSync(filePath, 'utf8');
		// If the item is a file: show the content of that file.
		return res.send(fileContent);
	}
});
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'public/assets/');
	},
	filename: function(req, file, cb) {
		console.log(file);
		cb(null, file.originalname);
	}
});
const upload = multer({ storage });
app.use(upload.single('picture'));

app.post(
	'/picture',
	upload.single('picture', (c) => {
		console.log(c);
	}),
	register
);
app.get('/', (req, res) => {
	res.status(201).sendFile(path.join(__dirname, 'public/index.html'));
});
app.post('/auth/register', register);
/*  ROUTES */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use(
	'/posts',
	(req, res, next) => {
		console.log('posts from index fired');
		next();
	},
	postRoutes
);
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

mongoose
	.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((res, err) => {
		app.listen(PORT, () => console.log(`server connected to :${PORT}`));
		// User.insertMany(users).then((r) => console.log(r.length));
		// Post.insertMany(posts).then((r) => console.log(r.length));
	})
	.catch((error) => {
		console.log(error, "Can't connect");
	});
