import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required')
                .matches(/^[a-zA-Z '-,.]+$/,
                    "Name only allow letters, spaces and characters: ' - , ."),
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                    "Password at least 1 letter and 1 number"),
            confirmPassword: yup.string().trim()
                .required('Confirm password is required')
                .oneOf([yup.ref('password')], 'Passwords must match')
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            http.post("/user/register", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/login");
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    });

    return (
        <Box sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <h5>Register</h5>
            <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
                <label>
                    Name
                    <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.name && formik.errors.name ? 'error' : ''}
                        aria-invalid={formik.touched.name && formik.errors.name ? 'true' : 'false'}
                        autoComplete='off'
                    />
                    {formik.touched.name && formik.errors.name && <small>{formik.errors.name}</small>}
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.email && formik.errors.email ? 'error' : ''}
                        aria-invalid={formik.touched.email && formik.errors.email ? 'true' : 'false'}
                        autoComplete='off'
                    />
                    {formik.touched.email && formik.errors.email && <small>{formik.errors.email}</small>}
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.password && formik.errors.password ? 'error' : ''}
                        aria-invalid={formik.touched.password && formik.errors.password ? 'true' : 'false'}
                        autoComplete='off'
                    />
                    {formik.touched.password && formik.errors.password && <small>{formik.errors.password}</small>}
                </label>

                <label>
                    Confirm Password
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
                        aria-invalid={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'true' : 'false'}
                        autoComplete='off'
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && <small>{formik.errors.confirmPassword}</small>}
                </label>

                <button type="submit">
                    Register
                </button>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default Register;