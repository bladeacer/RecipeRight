import React, { useState } from 'react';
import { Box, TextField, Button, Alert, IconButton, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';

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
                sx={{ alignSelf: 'flex-start', mb: 2, color: "var(--pico-background-white-500)" }} >
                <ArrowBack sx={{ mt: 0.5 }} /> Back
            </IconButton>
            <h4 style={{ mb: 4, textAlign: 'center' }}>
                Edit Security Information
            </h4>
            {error && <Alert severity="error">{error}</Alert>}
            <label> Current Password
                <input
                    required
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={formik.touched.currentPassword && formik.errors.currentPassword ? 'true' : 'false'}
                />
                {formik.touched.currentPassword && formik.errors.currentPassword && <small>{formik.errors.currentPassword}</small>}
            </label>
            <label>New Email
                <input
                    id="newEmail"
                    name="newEmail"
                    value={formik.values.newEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={formik.touched.newEmail && formik.errors.newEmail ? 'true' : 'false'}
                />
                {formik.touched.newEmail && formik.errors.newEmail && <small>{formik.errors.newEmail}</small>}
            </label>
            <label>Confirm New Email
                <input
                    id="confirmNewEmail"
                    name="confirmNewEmail"
                    value={formik.values.confirmNewEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={formik.touched.confirmNewEmail && formik.errors.confirmNewEmail ? 'true' : 'false'}
                />
                {formik.touched.confirmNewEmail && formik.errors.confirmNewEmail && <small>{formik.errors.confirmNewEmail}</small>}
            </label>
            <label> New Password
                <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={formik.touched.newPassword && formik.errors.newPassword ? 'true' : 'false'}
                />
                {formik.touched.newPassword && formik.errors.newPassword && <small>{formik.errors.newPassword}</small>}
            </label>
            <label>Confirm New Password
                <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    value={formik.values.confirmNewPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? 'true' : 'false'}
                />
                {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword && <small>{formik.errors.confirmNewPassword}</small>}
            </label>
            <button type="submit">Change Security Settings</button>
        </Box>
    );
}

export default ChangeSecurity;
