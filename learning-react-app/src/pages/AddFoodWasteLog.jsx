import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddFoodWasteEntry() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            ingredientId: "",
            wasteAmount: "",
            loggedOn: "",
            wasteReason: "",
        },
        validationSchema: yup.object({
            ingredientId: yup.number().required('Ingredient ID is required'),
            wasteAmount: yup.number().positive('Waste Amount must be positive').required('Waste Amount is required'),
            loggedOn: yup.date().required('Logged On date is required'),
            wasteReason: yup.string().trim().required('Waste Reason is required'),
        }),
        onSubmit: (data) => {
            http.post("/foodWasteEntry", data)
                .then(() => {
                    toast.success('Food waste entry added successfully!');
                    navigate("/food-waste-logs");
                })
                .catch((err) => {
                    toast.error('Failed to add food waste entry.');
                    console.error(err);
                });
        },
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>Add Food Waste Entry</Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth margin="dense" label="Ingredient ID" name="ingredientId" value={formik.values.ingredientId} onChange={formik.handleChange} error={formik.touched.ingredientId && Boolean(formik.errors.ingredientId)} helperText={formik.touched.ingredientId && formik.errors.ingredientId} />
                        <TextField fullWidth margin="dense" label="Waste Amount (kg)" name="wasteAmount" value={formik.values.wasteAmount} onChange={formik.handleChange} error={formik.touched.wasteAmount && Boolean(formik.errors.wasteAmount)} helperText={formik.touched.wasteAmount && formik.errors.wasteAmount} />
                        <TextField fullWidth margin="dense" type="datetime-local" label="Logged On" name="loggedOn" value={formik.values.loggedOn} onChange={formik.handleChange} error={formik.touched.loggedOn && Boolean(formik.errors.loggedOn)} helperText={formik.touched.loggedOn && formik.errors.loggedOn} InputLabelProps={{ shrink: true }} />
                        <TextField fullWidth margin="dense" label="Waste Reason" name="wasteReason" value={formik.values.wasteReason} onChange={formik.handleChange} error={formik.touched.wasteReason && Boolean(formik.errors.wasteReason)} helperText={formik.touched.wasteReason && formik.errors.wasteReason} />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit" color="primary">Add Entry</Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}
