import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
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
            console.log("Submitting data:", data);
            http.post("/SustainabilityGoal", data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then((res) => {
                    console.log("Response received:", res);
                    toast.success('Sustainability goal added successfully!');
                    navigate("/sustainability-goals");
                })
                .catch((err) => {
                    console.error("API Error:", err);
                    toast.error('Failed to add sustainability goal.');
                });
        },
    });

    return (
        <Box>
            <h5>Add Sustainability Goal</h5>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <label>
                    Goal Name
                    <input type="text"
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
                    <input type="text"
                        placeholder='Enter a description'
                        id='goalDescription'
                        name="goalDescription"
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
                        name="targetValue"
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
                        name="currentValue"
                        value={formik.values.currentValue}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        aria-invalid={formik.touched.currentValue && formik.errors.currentValue ? 'true' : 'false'}
                        autoComplete='off'
                    />
                    {formik.touched.currentValue && formik.errors.currentValue && <small>{formik.errors.currentValue}</small>}
                </label>
                <label>
                    Deadline
                    <input
                        type="datetime-local"
                        id='deadline'
                        name="deadline"
                        value={formik.values.deadline}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        aria-invalid={formik.touched.deadline && formik.errors.deadline ? 'true' : 'false'}
                        autoComplete='off'
                    />
                    {formik.touched.deadline && formik.errors.deadline && <small>{formik.errors.deadline}</small>}
                </label>
                <button type="submit"> Add Goal </button>
            </Box>
            <ToastContainer />
        </Box>
    );
}
