import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Form from 'scenes/loginPage/Form';
const LoginPage = (props) => {
	const theme = useTheme();
	const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
	console.log(props);

	return (
		<Box>
			<Box width="100%" background={theme.palette.background.alt} p="1rem 6%" textAlign="center">
				<Typography fontWeight="bold" fontSize="32px" color="promary">
					Sociopedia
				</Typography>
			</Box>
			<Box
				width={isNonMobileScreens ? '50%' : '93%'}
				p="2rem"
				m="2rem auto"
				borderRadius="1.5rem"
				backgroundColor={theme.palette.background.alt}
			>
				<Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }}>
					welcome to Socipedia, the webinar for cool-Nerd
				</Typography>
				<Form />
			</Box>
		</Box>
	);
};

export default LoginPage;
