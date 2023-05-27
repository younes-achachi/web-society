import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/*REGISTER USER */
export const register = async (req, res) => {
	console.log(req.body);

	try {
		const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);
		const newUser = new User({
			firstName,
			lastName,
			email,
			password: passwordHash,
			picturePath,
			friends,
			location,
			occupation,
			viewedProfile: Math.floor(Math.random() * 10000),
			impression: Math.floor(Math.random() * 10000)
		});
		const saveUser = await newUser.save();
		res.status(201).json(saveUser);
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};
/* LOGGING  IN */
export const login = async (req, res) => {
	console.log(req.body, 'body');
	// const func = () => {
	// 	const header = Object.keys(req).filter((e) => {
	// 		if (e.match(/header.*/i)) {
	// 			return e;
	// 		}
	// 	});
	// 	return req[header];
	// };
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });
		if (!user) return res.status(400).json({ msg: 'User does not exist.' });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ msg: 'Invalid credential. ' });
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
		delete user.password;
		res.status(200).json({ token, user });
	} catch (err) {
		// console.log(res);
		res.status(500).json({ error: err.message });
	}
};
