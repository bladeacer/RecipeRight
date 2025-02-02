import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import Login from '/Login';
import Register from '/Register';

function LoginRegister() {
    const [tabValue, setTabValue] = useState(0); // State for active tab (0 = Login, 1 = Register)

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                backgroundColor: '#f9f9f9',
            }}
        >
            {/* Left Side */}
            <Box
                sx={{
                    flex: 1,
                    backgroundImage: 'url(https://source.unsplash.com/random)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Right Side */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                    backgroundColor: '#fff',
                }}
            >
                {/* Logo */}
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: 4,
                        background: 'linear-gradient(90deg, #ff512f, #dd2476)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Welcome to Our Platform
                </Typography>

                {/* Tabs */}
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ marginBottom: 4, width: '100%', maxWidth: 400 }}
                >
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                {/* Form Rendering */}
                {tabValue === 0 ? <Login /> : <Register />}
            </Box>
        </Box>
    );
}

export default LoginRegister;
