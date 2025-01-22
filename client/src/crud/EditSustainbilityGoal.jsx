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

    const [goal, setGoal] = useState({
        goalId: 0,
        goalName: "",
        targetValue: "",
        currentValue: "",
        deadline: "",
        createdOn: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/sustainabilitygoal/${id}`).then((res) => {
            setGoal(res.data);
            setLoading(false);
        }).catch(err => {
            toast.error("Error fetching goal data.");
        });
    }, [id]);

    const formik = useFormik({
        initialValues: goal,
        enableReinitialize: true,
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
            http.put(`/sustainabilitygoal/${id}`, data).then((res) => {
                toast.success("Sustainability Goal updated successfully!");
                navigate("/sustainabilitygoals");
            }).catch(err => {
                toast.error("Error updating goal. Please try again.");
            });
        }
    });

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const deleteGoal = () => {
        http.delete(`/sustainabilitygoal/${id}`).then((res) => {
            toast.success("Sustainability Goal deleted successfully!");
            navigate("/sustainabilitygoals");
        }).catch(err => {
            toast.error("Error deleting goal. Please try again.");
        });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Sustainability Goal
            </Typography>
            {
                !loading && (
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
                        Are you sure you want to delete this Sustainability Goal?
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
