import {
	EditOutlined,
	DeleteOutline,
	AttachFileOutlined,
	GifBoxOutlined,
	ImageOutlined,
	MicOutlined,
	MoreHorizOutlined
} from '@mui/icons-material';
import React from 'react';
import { Box, Divider, Typography, InputBase, useTheme, Button, IconButton, useMediaQuery } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Dropzone from 'react-dropzone';
import UserImage from 'components/UserImage';
import WidgetWrapper from 'components/WidgetWrapper';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from 'state';

const MyPostWidget = ({ picturePath }) => {
	const dispatch = useDispatch();
	const [ isImage, setIsImage ] = useState(false);
	const [ image, setImage ] = useState(null);
	const [ post, setPost ] = useState('');
	const { palette } = useTheme();
	const { _id } = useSelector((state) => state.user);
	const token = useSelector((state) => state.token);
	const isNonMobileScreens = useMediaQuery('(min-width:1000px');
	const mediumMain = palette.neutral.mediumMain;
	const medium = palette.neutral.medium;
	const handlePost = async () => {
		const formData = new FormData();
		formData.append('userId'._id);
		formData.append('description', post);
		if (image) {
			formData.append('picture', image);
			formData.append('picturePath', image.name);
		}

		const response = await fetch('http://locahost:5001/posts', {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },
			body: formData
		});
		const Posts = await response.json();
		dispatch(setPosts({ Posts }));
		setPost('');
	};
	return (
		<WidgetWrapper>
			<FlexBetween gap="1.5rem">
				<UserImage image={picturePath}> </UserImage>
				<InputBase
					placeholder="What's on your mind..."
					onChange={(e) => setPost(e.target.value)}
					value={post}
					sx={{
						width: '100%',
						backgroundColor: palette.neutral.light,
						borderRadius: '2rem',
						padding: '1rem 2rem'
					}}
				/>

				{isImage && (
					<Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="1rem">
						<Dropzone
							accept="image/*"
							multiple={Boolean(null)}
							onDrop={(acceptedFiles) => {
								console.log(acceptedFiles);
								return setImage(acceptedFiles[0]);
							}}
						>
							{({ getRootProps, getInputProps, open }) => (
								<FlexBetween>
									<Box
										{...getRootProps()}
										border={`2px dashed ${palette.primary.main}`}
										p="1rem"
										width="100%"
										sx={{ '&:hover': { cursor: 'pointer' } }}
									>
										<input {...getInputProps()} accept="image/*" />
										{!image ? (
											<p>Add Image Here</p>
										) : (
											<FlexBetween>{image && <FlexBetween>{open}</FlexBetween>}</FlexBetween>
										)}
									</Box>
									<FlexBetween
										sx={{ '&>:hover': { cursor: 'pointer' } }}
										sx={{ flexDirection: 'column', marginLeft: '10px' }}
									>
										<IconButton>
											<EditOutlined {...getRootProps()} />
										</IconButton>
										{image && (
											<IconButton onClick={() => setImage(null)} sx={{ width: '15%' }}>
												<DeleteOutline />
											</IconButton>
										)}
									</FlexBetween>
								</FlexBetween>
							)}
						</Dropzone>
					</Box>
				)}
			</FlexBetween>
			<Divider sx={{ margin: '1.25rem 0' }} />
			<FlexBetween sx={{ '&>:hover': { cursor: 'pointer', color: medium } }}>
				<FlexBetween gap={'0.25rem'} onClick={() => setIsImage(!isImage)}>
					<ImageOutlined sx={{ color: mediumMain }}> </ImageOutlined>
					<Typography color={mediumMain} sx={{ '&:hover': { cursor: 'pointer', color: medium } }}>
						Image
					</Typography>
				</FlexBetween>
				{isNonMobileScreens ? (
					<React.Fragment>
						<FlexBetween gap="0.25rem">
							<GifBoxOutlined sx={{ color: mediumMain }} />
							<Typography color={mediumMain}>Clip</Typography>
						</FlexBetween>

						<FlexBetween gap="0.25rem">
							<AttachFileOutlined sx={{ color: mediumMain }} />
							<Typography color={mediumMain}>Attachment</Typography>
						</FlexBetween>

						<FlexBetween gap="0.25rem">
							<MicOutlined sx={{ color: mediumMain }} />
							<Typography color={mediumMain}>Audio</Typography>
						</FlexBetween>
					</React.Fragment>
				) : (
					<FlexBetween gap="0.25rem">
						<MoreHorizOutlined sx={{ color: mediumMain }} />
					</FlexBetween>
				)}
				<Button
					disabled={!post}
					onClick={handlePost}
					sx={{
						color: palette.background.alt,
						backgroundColor: palette.primary.main,
						borderRadius: '3rem'
					}}
				>
					POST
				</Button>
			</FlexBetween>
		</WidgetWrapper>
	);
};
export default MyPostWidget;
