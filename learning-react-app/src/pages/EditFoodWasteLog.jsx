import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditFoodWasteEntry() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entry, setEntry] = useState({
        wasteId: 0,
        ingredientId: 0,
        wasteAmount: 0,
        loggedOn: "",
        wasteReason: "",
    });

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const deleteEntry = () => {
        http.delete(`/foodWasteEntry/${id}`).then(() => {
            toast.success('Food waste entry deleted successfully!');
            navigate("/food-waste-logs");
        });
    };

    useEffect(() => {
        http.get(`/foodWasteEntry/${id}`).then((res) => {
            setEntry(res.data);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: entry,
        enableReinitialize: true,
        validationSchema: yup.object({
            ingredientId: yup.number().required('Ingredient ID is required'),
            wasteAmount: yup.number().min(1, 'Waste Amount must be greater than 0').required('Waste Amount is required'),
            loggedOn: yup.date().required('Logged On date is required'),
            wasteReason: yup.string().trim().required('Waste Reason is required'),
        }),
        onSubmit: (data) => {
            http.put(`/foodWasteEntry/${id}`, data).then(() => {
                toast.success('Food waste entry updated successfully!');
                navigate("/food-waste-logs");
            });
        },
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>Edit Food Waste Entry</Typography>
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
                    <Button variant="contained" type="submit">Update</Button>
                    <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={handleOpen}>Delete</Button>
                </Box>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Food Waste Entry</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this entry?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={deleteEntry}>Delete</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
}