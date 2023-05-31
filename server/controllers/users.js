import User from '../models/User.js';

// READ
export const getUser = async (req, res) => {
	try {
		console.log(',kjhkjlhlkjhkjhkljhlkh');

		const { id } = req.params;
		const user = await User.findById(id);
		res.status(201).json(user);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

export const getUserFriends = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
		const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({
			_id,
			firstName,
			lastName,
			occupation,
			location,
			picturePath
		}));
		res.status(201).json(formattedFriends);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const addRemoveFriend = async (req, res) => {
	try {
		const { id, friendId } = req.params;
		const user = await User.findById(id);
		const friend = await User.findById(id);
		if (user.friends.includes(friendId)) {
			user.friends = user.friends.filter((id) => id !== friendId);
			friend.friends = friend.friends.filter((fId) => fid !== id);
		} else {
			user.friends.push(friendId);
			friends.friends.push(id);
		}
		await user.save();
		await friend.save();
		const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
		const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({
			_id,
			firstName,
			lastName,
			occupation,
			location,
			picturePath
		}));
		res.status(201).json(formattedFriends);
	} catch (e) {
		res.status(404).json({ message: e.message });
	}
};
