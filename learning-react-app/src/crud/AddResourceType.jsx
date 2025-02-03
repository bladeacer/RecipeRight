import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid2 as Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddResourceType() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            typeName: "",
            resourceTypeDescription: ""
        },
        validationSchema: yup.object({
            typeName: yup.string().trim()
                .min(3, 'Type Name must be at least 3 characters')
                .max(100, 'Type Name must be at most 100 characters')
                .required('Type Name is required'),
            resourceTypeDescription: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required')
        }),
        onSubmit: (data) => {
            http.post("/resourcetype", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/resourcetypes");
                })
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Resource Type
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Resource Type Name"
                            name="typeName"
                            value={formik.values.typeName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.typeName && Boolean(formik.errors.typeName)}
                            helperText={formik.touched.typeName && formik.errors.typeName}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Resource Type Description"
                            name="resourceTypeDescription"
                            value={formik.values.resourceTypeDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.resourceTypeDescription && Boolean(formik.errors.resourceTypeDescription)}
                            helperText={formik.touched.resourceTypeDescription && formik.errors.resourceTypeDescription}
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
    )
}