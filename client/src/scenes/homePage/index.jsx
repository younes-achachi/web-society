import React from 'react';
import Navbar from 'scenes/navbar';
import { useSelector } from 'react-redux';
import { Box, useMediaQuery } from '@mui/material';
import UserWidget from 'scenes/widgets/UserWidget';
import MyPostWidget from 'scenes/widgets/MyPostWidget';
import PostsWidget from 'scenes/widgets/PostsWidget';
const HomePage = () => {
	const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
	const { _id, picturePath } = useSelector((state) => state.user);

	return (
		<div>
			<Navbar />
			<Box
				width="100%"
				padding="2rem 6%"
				display={isNonMobileScreens ? 'flex' : 'block'}
				gap="0.5rem"
				justifyContent="space-between"
			>
				<Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
					<UserWidget userId={_id} picturePath={picturePath} />
				</Box>
				<Box flexBasis={isNonMobileScreens ? '42%' : undefined} mt={isNonMobileScreens ? undefined : '2rem'}>
					<MyPostWidget picturePath={picturePath} />
				</Box>
				<PostsWidget />
				{isNonMobileScreens && <Box flexBasis="26%" />}
			</Box>
		</div>
	);
};

export default HomePage;
