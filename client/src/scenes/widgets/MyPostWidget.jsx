import {
	EditOutlined,
	DeleteOutline,
	AttachFileOutlined,
	GifBoxOutlined,
	ImageOutlined,
	MicOutlined,
	MoreHorizOutlined
} from '@mui/icons-material';
import React, { useEffect } from 'react';
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
		formData.append('userId', _id);
		formData.append('description', post);

		if (image) {
			console.log(image);
			formData.append('picture', image);
			formData.append('picturePath', image.name);
		}

		const response = await fetch('http://localhost:5001/posts/', {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },

			body: formData
		});
		const Posts = await response.json();
		if (Posts) {
			dispatch(setPosts({ Posts }));
			console.log(post);
			setPost('');
		}
	};
	useEffect(
		() => () => {
			// Make sure to revoke the data uris to avoid memory leaks
			console.log(image, 'the image');
			image && URL.revokeObjectURL(image.preview);
		},
		[ image ]
	);
	return (
		<WidgetWrapper>
			<FlexBetween gap="1.5rem">
				<UserImage image={picturePath}> </UserImage>
				<InputBase
					placeholder="What's on your mind..."
					onChange={(e) => setPost(e.target.value)}
					value={post}
					multiline
					maxRows="10"
					sx={{
						width: '100%',
						backgroundColor: palette.neutral.light,
						borderRadius: '2rem',
						padding: '1rem 2rem'
					}}
				/>

				{isImage && (
					<Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="0.2rem">
						<Dropzone
							accept="image/*"
							multiple={Boolean(null)}
							onDrop={(acceptedFiles) => {
								acceptedFiles.map((file) =>
									setImage(
										Object.assign(file, {
											preview: URL.createObjectURL(file)
										})
									)
								);
							}}
						>
							{({ getRootProps, getInputProps, open }) => (
								<FlexBetween>
									<Box
										{...getRootProps()}
										border={`2px dashed ${palette.primary.main}`}
										p="0.5rem"
										width="100%"
										height="100%"
										sx={{ '&:hover': { cursor: 'pointer' } }}
									>
										<input {...getInputProps()} accept="image/*" />
										{!image ? (
											<p>Add Image Here</p>
										) : (
											<React.Fragment>
												{image && (
													<img
														src={image.preview}
														alt={image.name}
														height="100px"
														width="100px"
														style={{ marginBottom: '-5px' }}
													/>
												)}
											</React.Fragment>
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
