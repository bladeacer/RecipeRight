import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: '',
            image: null,
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required')
                .matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, 'Password at least 1 letter and 1 number'),
            confirmPassword: yup.string().trim()
                .required('Confirm password is required')
                .oneOf([yup.ref('password')], 'Passwords must match'),
            gender: yup.string().required('Gender is required'),
            image: yup.mixed().required('Image is required'),
        }),
        onSubmit: (data) => {
            const formData = new FormData();
            formData.append('name', data.name.trim());
            formData.append('email', data.email.trim().toLowerCase());
            formData.append('password', data.password.trim());
            formData.append('gender', data.gender);
            formData.append('image', data.image);

            http.post('/user/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(() => {
                    navigate('/login');
                })
                .catch((err) => {
                    toast.error(`${err.response.data.message}`);
                });
        },
    });

    const handleImageChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            formik.setFieldValue('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

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
                    width: 400,
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: 3,
                    p: 4,
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={2}
                    textAlign="center"
                    sx={{ color: '#333' }}
                >
                    Registration
                </Typography>

                <Box component="form" onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Enter your name"
                        name="name"
                        autoComplete="off"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
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
                        label="Create a password"
                        name="password"
                        type="password"
                        autoComplete="off"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Confirm a password"
                        name="confirmPassword"
                        type="password"
                        autoComplete="off"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        select
                        label="Gender"
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.gender && Boolean(formik.errors.gender)}
                        helperText={formik.touched.gender && formik.errors.gender}
                    >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </TextField>

                    <FormControlLabel
                        control={<Checkbox />}
                        label="I accept all terms & conditions"
                        sx={{ mt: 2 }}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{
                            mt: 2,
                            py: 1.4,
                            bgcolor: '#4169E1', // Blue button
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#2950A8',
                            },
                        }}
                    >
                        Upload Image
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Button>
                    {imagePreview && (
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 4 }}
                            />
                        </Box>
                    )}

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{
                            mt: 3,
                            py: 1.5,
                            bgcolor: '#4169E1', // Blue button
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#2950A8',
                            },
                        }}
                    >
                        Register Now
                    </Button>
                    <Typography
                        variant="body2"
                        sx={{ mt: 2, textAlign: 'center', color: '#333' }}
                    >
                        Already have an account?{' '}
                        <Typography
                            component="span"
                            sx={{
                                color: '#4169E1',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Login now
                        </Typography>
                    </Typography>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default Register;
