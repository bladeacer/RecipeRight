import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid2 as Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditResourceType() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [rt, setRt] = useState({
        resourceTypeId: 0,
        typeName: "",
        resourceTypeDescription: "",
        createdAt: "",
        updatedAt: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/resourcetype/${id}`).then((res) => {
            setRt(res.data);
            setLoading(false);
            console.log(res.data);
            console.log(rt);
        });
    }, []);

    const formik = useFormik({
        initialValues: rt,
        enableReinitialize: true,
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
            data.typeName = data.typeName.trim();
            data.resourceTypeDescription = data.resourceTypeDescription.trim();
            http.put(`/resourcetype/${id}`, data).then((res) => {
                console.log(res.data);
                navigate("/resourcetypes")
            })
        }
    });

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const deleteRt = () => {
        http.delete(`/resourcetype/${id}`).then((res) => {
            console.log(res.data);
            navigate("/resourcetypes")
        })
    };

return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Resource Type
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12, md:6, lg:8}}>

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
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Resource Type
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this resource type?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteRt}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
}