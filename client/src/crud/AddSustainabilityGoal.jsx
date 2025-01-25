import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid2 as Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddSustainabilityGoal() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            goalName: "",
            goalDescription: "",
            targetValue: "",
            currentValue: "",
            deadline: "",
        },
        validationSchema: yup.object({
            goalName: yup.string().trim()
                .min(3, 'Goal Name must be at least 3 characters')
                .max(100, 'Goal Name must be at most 100 characters')
                .required('Goal Name is required'),
            goalDescription: yup.string().trim()
                .min(3, 'Goal Description must be at least 3 characters')
                .max(500, 'Goal Description must be at most 500 characters')
                .required('Goal Description is required'),
            targetValue: yup.number()
                .typeError('Target Value must be a number')
                .positive('Target Value must be positive')
                .required('Target Value is required'),
            currentValue: yup.number()
                .typeError('Current Value must be a number')
                .min(0, 'Current Value must be zero or greater')
                .required('Current Value is required'),
            deadline: yup.date()
                .typeError('Deadline must be a valid date')
                .min(new Date(), 'Deadline must be in the future')
                .required('Deadline is required'),
        }),
        onSubmit: (data) => {
            http.post("/SustainabilityGoal", data)
                .then((res) => {
                    toast.success('Sustainability goal added successfully!');
                    navigate("/sustainability-goals");
                })
                .catch((err) => {
                    toast.error('Failed to add sustainability goal.');
                    console.error(err);
                });
        },
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Sustainability Goal
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Goal Name"
                            name="goalName"
                            value={formik.values.goalName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.goalName && Boolean(formik.errors.goalName)}
                            helperText={formik.touched.goalName && formik.errors.goalName}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Goal Description"
                            name="goalDescription"
                            value={formik.values.goalDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.goalDescription && Boolean(formik.errors.goalDescription)}
                            helperText={formik.touched.goalDescription && formik.errors.goalDescription}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Target Value"
                            name="targetValue"
                            value={formik.values.targetValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.targetValue && Boolean(formik.errors.targetValue)}
                            helperText={formik.touched.targetValue && formik.errors.targetValue}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Current Value"
                            name="currentValue"
                            value={formik.values.currentValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.currentValue && Boolean(formik.errors.currentValue)}
                            helperText={formik.touched.currentValue && formik.errors.currentValue}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            type="datetime-local"
                            label="Deadline"
                            name="deadline"
                            value={formik.values.deadline}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.deadline && Boolean(formik.errors.deadline)}
                            helperText={formik.touched.deadline && formik.errors.deadline}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit" color="primary">
                        Add Goal
                    </Button>
                </Box>
            </Box>

            <ToastContainer />
        </Box>
    );
}
