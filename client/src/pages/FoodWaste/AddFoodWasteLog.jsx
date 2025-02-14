import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
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
            <h5>Add Food Waste Entry</h5>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <label>Ingredient ID
                    <input name="ingredientId" value={formik.values.ingredientId} onChange={formik.handleChange}
                        aria-invalid={formik.touched.ingredientId && formik.errors.ingredientId ? 'true' : 'false'} />
                    {formik.touched.ingredientId && formik.errors.ingredientId && <small>{formik.errors.ingredientId}</small>}
                </label>
                <label>Waste Amount (kg)
                    <input name="wasteAmount" value={formik.values.wasteAmount} onChange={formik.handleChange}
                        aria-invalid={formik.touched.wasteAmount && formik.errors.wasteAmount ? 'true' : 'false'} />
                    {formik.touched.wasteAmount && formik.errors.wasteAmount && <small>{formik.errors.wasteAmount}</small>}
                </label>
                <label>Logged On
                    <input type="datetime-local" name="loggedOn" value={formik.values.loggedOn} onChange={formik.handleChange}
                        aria-invalid={formik.touched.loggedOn && formik.errors.loggedOn ? 'true' : 'false'} />
                    {formik.touched.loggedOn && formik.errors.loggedOn && <small>{formik.errors.loggedOn}</small>}
                </label>
                <label>Waste Reason
                    <input name="wasteReason" value={formik.values.wasteReason} onChange={formik.handleChange}
                        aria-invalid={formik.touched.wasteReason && formik.errors.wasteReason ? 'true' : 'false'} />
                    {formik.touched.wasteReason && formik.errors.wasteReason && <small>{formik.errors.wasteReason}</small>}
                </label>
                <button type="submit" >Add Entry</button>
            </Box>
            <ToastContainer />
        </Box>
    );
}
