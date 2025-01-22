import React from 'react';
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
            targetValue: "",
            currentValue: "",
            deadline: "",
        },
        validationSchema: yup.object({
            goalName: yup.string().trim()
                .min(3, 'Goal Name must be at least 3 characters')
                .max(255, 'Goal Name must be at most 255 characters')
                .required('Goal Name is required'),
            targetValue: yup.number()
                .min(1, 'Target Value must be at least 1')
                .required('Target Value is required'),
            currentValue: yup.number()
                .min(0, 'Current Value must be at least 0')
                .required('Current Value is required'),
            deadline: yup.date()
                .required('Deadline is required'),
        }),
        onSubmit: (data) => {
            http.post("/sustainabilitygoal", data)
                .then((res) => {
                    toast.success("Sustainability Goal added successfully!");
                    navigate("/sustainabilitygoals");
                })
                .catch((err) => {
                    toast.error("Error adding Sustainability Goal. Please try again.");
                });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Sustainability Goal
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Goal Name"
                            name="goalName"
                            value={formik.values.goalName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.goalName && Boolean(formik.errors.goalName)}
                            helperText={formik.touched.goalName && formik.errors.goalName}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Target Value"
                            name="targetValue"
                            type="number"
                            value={formik.values.targetValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.targetValue && Boolean(formik.errors.targetValue)}
                            helperText={formik.touched.targetValue && formik.errors.targetValue}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Current Value"
                            name="currentValue"
                            type="number"
                            value={formik.values.currentValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.currentValue && Boolean(formik.errors.currentValue)}
                            helperText={formik.touched.currentValue && formik.errors.currentValue}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Deadline"
                            name="deadline"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.deadline}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.deadline && Boolean(formik.errors.deadline)}
                            helperText={formik.touched.deadline && formik.errors.deadline}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>

            <ToastContainer />
        </Box>
    );
}
