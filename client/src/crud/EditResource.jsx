import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid2 as Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditResource() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rtOptions, setRtOptions] = useState([]);
    const [rtDesc, setRtDesc] = useState('not selected');
    const [loading, setLoading] = useState(true);
    const [res, setRes] = useState({
        resourceId: 0,
        resourceName: "",
        resourceDescription: "",
        resourceTypeId: 0,
    });

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const getRTs = () => {
        http.get("/resourcetype").then((res) => {
            setRtOptions(res.data);
        });
    };
    const deleteRes = () => {
        http.delete(`/resource/${id}`).then((res) => {
            console.log(res.data);
            navigate("/resources");
        });
    }
    useEffect(() => {
        http.get(`/resource/${id}`).then((res) => {
            setRes(res.data);
        });
        getRTs();
        setLoading(false);
    }, []);

    const formik = useFormik({
        initialValues: {
            resourceTypeId: res.resourceTypeId,
            resourceName: res.resourceName,
            resourceDescription: res.resourceDescription,
        },

        validationSchema: yup.object({
            resourceTypeId: yup.number()
                .min(1, 'Please select a valid Resource Type')
                .required('Resource Type is required'),
            resourceName: yup.string().trim()
                .min(3, 'Resource Name must be at least 3 characters')
                .max(100, 'Resource Name must be at most 100 characters')
                .required('Resource Name is required'),
            resourceDescription: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required')
        }),
        onSubmit: (data) => {
            http.put(`/resource/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/resources");
                })
        }
    });

    const handleResourceTypeChange = (event) => {
        const selectedResourceTypeId = event.target.value;
        formik.setFieldValue('resourceTypeId', selectedResourceTypeId);

        const selectedResourceType = rtOptions.find(rt => rt.resourceTypeId === parseInt(selectedResourceTypeId));
        if (selectedResourceType) {
            setRtDesc(selectedResourceType.resourceTypeDescription);
        } else {
            setRtDesc('not selected');
        }
    }

    // TODO: return for edit resource

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Resource
            </Typography>
            {
                !loading && (

                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={8}>
                                <TextField
                                    select
                                    fullWidth
                                    margin="dense"
                                    label="Select Resource Type"
                                    name="resourceTypeId"
                                    value={formik.values.resourceTypeId}
                                    onChange={handleResourceTypeChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.resourceTypeId && Boolean(formik.errors.resourceTypeId)}
                                    helperText={formik.touched.resourceTypeId && formik.errors.resourceTypeId}
                                    slotProps={{
                                        select: { native: true },
                                    }}
                                >
                                    <option value={0}>Select Resource Type</option>
                                    {rtOptions.map((rt) => (
                                        <option key={rt.resourceTypeId} value={rt.resourceTypeId}>
                                            {rt.typeName}
                                        </option>
                                    ))}
                                </TextField>

                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Resource Name"
                                    name="resourceName"
                                    value={formik.values.resourceName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.resourceName && Boolean(formik.errors.resourceName)}
                                    helperText={formik.touched.resourceName && formik.errors.resourceName}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    multiline
                                    minRows={2}
                                    label="Description"
                                    name="resourceDescription"
                                    value={formik.values.resourceDescription}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.resourceDescription && Boolean(formik.errors.resourceDescription)}
                                    helperText={formik.touched.resourceDescription && formik.errors.resourceDescription}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <Box sx={{ textAlign: 'center', ml: 6 }}>
                                    <Typography> Resource Type Description: {rtDesc} </Typography>
                                </Box>
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
                    Delete Resource
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this resource?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteRes}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
}