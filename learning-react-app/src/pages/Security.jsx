import React, { useState } from 'react';
import { Box, TextField, Button, Alert, IconButton, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function ChangeSecurity() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newEmail: '',
            confirmNewEmail: '',
            newPassword: '',
            confirmNewPassword: ''
        },
        validationSchema: yup.object({
            currentPassword: yup.string().trim()
                .required('Current password is required'),
            newEmail: yup.string().trim()
                .email('Enter a valid email')
                .nullable(),
            confirmNewEmail: yup.string().trim()
                .oneOf([yup.ref('newEmail')], 'New emails do not match')
                .nullable(),
            newPassword: yup.string().trim()
                .min(8, 'New password must be at least 8 characters')
                .max(50, 'New password must be at most 50 characters')
                .nullable(),
            confirmNewPassword: yup.string().trim()
                .oneOf([yup.ref('newPassword')], 'New passwords do not match')
                .nullable()
        }),
        onSubmit: async (data) => {
            setError('');

            const formData = new FormData();
            formData.append('CurrentPassword', data.currentPassword.trim());
            if (data.newEmail) {
                formData.append('NewEmail', data.newEmail.trim().toLowerCase());
                formData.append('ConfirmNewEmail', data.confirmNewEmail.trim().toLowerCase());
            }
            if (data.newPassword) {
                formData.append('NewPassword', data.newPassword.trim());
                formData.append('ConfirmNewPassword', data.confirmNewPassword.trim());
            }

            try {
                await http.put('/user/change-security', formData);
                navigate('/profile');
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Something went wrong. Please check all fields are filled in.');
            }
        }
    });

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <IconButton
                onClick={() => navigate(-1)}
                sx={{ alignSelf: 'flex-start', mb: 2 }}
            >
                <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
                Edit Security Information
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
                margin="normal"
                required
                fullWidth
                id="currentPassword"
                label="Current Password"
                name="currentPassword"
                type="password"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                helperText={formik.touched.currentPassword && formik.errors.currentPassword}
            />
            <TextField
                margin="normal"
                fullWidth
                id="newEmail"
                label="New Email"
                name="newEmail"
                value={formik.values.newEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newEmail && Boolean(formik.errors.newEmail)}
                helperText={formik.touched.newEmail && formik.errors.newEmail}
            />
            <TextField
                margin="normal"
                fullWidth
                id="confirmNewEmail"
                label="Confirm New Email"
                name="confirmNewEmail"
                value={formik.values.confirmNewEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmNewEmail && Boolean(formik.errors.confirmNewEmail)}
                helperText={formik.touched.confirmNewEmail && formik.errors.confirmNewEmail}
            />
            <TextField
                margin="normal"
                fullWidth
                id="newPassword"
                label="New Password"
                name="newPassword"
                type="password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                helperText={formik.touched.newPassword && formik.errors.newPassword}
            />
            <TextField
                margin="normal"
                fullWidth
                id="confirmNewPassword"
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                value={formik.values.confirmNewPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmNewPassword && Boolean(formik.errors.confirmNewPassword)}
                helperText={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Change Security Settings
            </Button>
        </Box>
    );
}

export default ChangeSecurity;
