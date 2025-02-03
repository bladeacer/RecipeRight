import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid2 as Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditSustainabilityGoal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [goal, setGoal] = useState({
        sustainabilityGoalId: 0,
        goalName: "",
        goalDescription: "",
        targetValue: 0,
        currentValue: 0,
        deadline: "",
    });

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const deleteGoal = () => {
        http.delete(`/sustainabilityGoal/${id}`).then((res) => {
            console.log(res.data);
            navigate("/sustainability-goals");
        });
    };

    useEffect(() => {
        http.get(`/sustainabilityGoal/${id}`).then((res) => {
            setGoal(res.data);
        });
        setLoading(false);
    }, []);

    const formik = useFormik({
        initialValues: {
            goalName: goal.goalName,
            goalDescription: goal.goalDescription,
            targetValue: goal.targetValue,
            currentValue: goal.currentValue,
            deadline: goal.deadline,
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            goalName: yup.string().trim()
                .min(3, 'Goal Name must be at least 3 characters')
                .max(100, 'Goal Name must be at most 100 characters')
                .required('Goal Name is required'),
            goalDescription: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            targetValue: yup.number()
                .min(1, 'Target Value must be greater than 0')
                .required('Target Value is required'),
            currentValue: yup.number()
                .min(0, 'Current Value must be 0 or greater')
                .required('Current Value is required'),
            deadline: yup.date()
                .required('Deadline is required'),
        }),
        onSubmit: (data) => {
            http.put(`/sustainabilityGoal/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/sustainability-goals");
                });
        },
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Sustainability Goal
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={8}>
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
                                    label="Description"
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
                                    type="number"
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
                                    type="number"
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
                                    autoComplete="off"
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
                    Delete Sustainability Goal
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this goal?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteGoal}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
}
