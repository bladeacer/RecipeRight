import React, { useContext } from 'react';
import { Box, Typography, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: yup.object({
            email: yup
                .string()
                .trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup
                .string()
                .trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required'),
        }),
        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            http.post('/user/login', data)
                .then((res) => {
                    const { user, accessToken } = res.data;

                    // Store token and user in context/local storage
                    localStorage.setItem('accessToken', accessToken);
                    setUser(user);

                    // Navigate based on role
                    if (user.role === 'Admin') {
                        navigate('/admin/dashboard'); // Admin-specific route
                    } else {
                        navigate('/tutorials'); // Regular user route
                    }
                })
                .catch((err) => {
                    toast.error(`${err.response.data.message}`);
                });
        },
    });

    return (
        <Box
            sx={{
                position: 'absolute',
        top: '64px', // Offset equal to the AppBar height
        left: 0,
        width: '100%', // Full width of the page
        height: 'calc(100vh - 64px)', // Full height minus AppBar height
        backgroundColor: '#6495ED', // Blue background
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
            }}
        >
            <Box
                sx={{
                    width: 350,
                    bgcolor: 'white',
                    borderRadius: 3,
                    p: 4,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
                    Login
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Enter your email"
                        name="email"
                        autoComplete="off"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Confirm a password"
                        name="password"
                        type="password"
                        autoComplete="off"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <FormControlLabel control={<Checkbox />} label="Remember me" />
                        <Typography
                            variant="body2"
                            sx={{ color: '#4169E1', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Forgot password?
                        </Typography>
                    </Box>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{
                            mt: 2,
                            bgcolor: '#4169E1',
                            py: 1.4,
                            '&:hover': {
                                bgcolor: '#2950A8',
                            },
                        }}
                    >
                        Login Now
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        Don't have an account?{' '}
                        <Typography
                            component="span"
                            sx={{ color: '#4169E1', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => navigate('/register')}
                        >
                            Signup now
                        </Typography>
                    </Typography>
                </Box>
                <ToastContainer />
            </Box>
        </Box>
    );
}

export default Login;
