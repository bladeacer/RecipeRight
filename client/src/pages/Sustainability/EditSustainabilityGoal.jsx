import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid2 as Grid } from '@mui/material';
import http from '../../http';
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
    }, [id]);

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
            <h5>Edit Sustainability Goal</h5>
            {!loading && !open && (
                <Box component="form" onSubmit={formik.handleSubmit}>

                    <label>
                        Goal Name
                        <input type="textarea"
                            id='goalName'
                            name="goalName"
                            value={formik.values.goalName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-invalid={formik.touched.goalName && formik.errors.goalName ? 'true' : 'false'}
                            autoComplete='off'
                        />
                        {formik.touched.goalName && formik.errors.goalName && <small>{formik.errors.goalName}</small>}
                    </label>

                    <label>
                        Description
                        <input placeholder='Enter a description'
                            id='goalDescription'
                            value={formik.values.goalDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-invalid={formik.touched.goalDescription && formik.errors.goalDescription ? 'true' : 'false'}
                            autoComplete='off'
                        />
                        {formik.touched.goalDescription && formik.errors.goalDescription && <small>{formik.errors.goalDescription}</small>}
                    </label>

                    <label>
                        Target Value
                        <input
                            type="number"
                            id='targetValue'
                            value={formik.values.targetValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-invalid={formik.touched.targetValue && formik.errors.targetValue ? 'true' : 'false'}
                            autoComplete='off'
                        />
                        {formik.touched.targetValue && formik.errors.targetValue && <small>{formik.errors.targetValue}</small>}
                    </label>

                    <label>
                        Current Value
                        <input
                            type="number"
                            id='currentValue'
                            value={formik.values.currentValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-invalid={formik.touched.currentValue && formik.errors.currentValue ? 'true' : 'false'}
                            autoComplete='off'
                        />
                        {formik.touched.currentValue && formik.errors.currentValue && <small>{formik.errors.currentValue}</small>}
                    </label>

                    <label>
                        <input
                            autoComplete="off"
                            type="datetime-local"
                            label="Deadline"
                            name="deadline"
                            value={formik.values.deadline}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-invalid={formik.touched.deadline && formik.errors.deadline ? 'true' : 'false'}
                        />
                        {formik.touched.deadline && formik.errors.deadline && <small>{formik.errors.deadline}</small>}
                    </label>

                    <button type="submit"> Update </button>
                    <button className='pico-background-red-500' onClick={handleOpen}> Delete </button>
                </Box>
            )
            }

            {loading && !open && (
                <h3 aria-busy="true"> Loading... </h3>
            )}

            <dialog open={open} onClose={handleClose}>
                <article>
                    <header>
                        <h5> Delete Sustainability Goal</h5>
                    </header>
                    <p> Are you sure you want to delete this goal?  </p>
                    <footer>
                        <button onClick={handleClose}>
                            Cancel
                        </button>
                        <button className='pico-background-red-500' onClick={deleteGoal}>
                            Delete
                        </button>
                    </footer>
                </article>
            </dialog>

            <ToastContainer />
        </Box>
    );
}
