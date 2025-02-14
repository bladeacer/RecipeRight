import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import http from '../../http';
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
            <h5>Edit Food Waste Entry</h5>
            {!open && (
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
                    <button type="submit">Update</button>
                    <button className="pico-background-red-500" onClick={handleOpen}>Delete</button>
                </Box>

            )}
            <dialog open={open} onClose={handleClose}>
                <article>
                    <header>
                        <h5> Delete Food Waste Entry</h5>
                    </header>
                    <p> Are you sure you want to delete this entry?  </p>
                    <footer>
                        <button onClick={handleClose}>
                            Cancel
                        </button>
                        <button className='pico-background-red-500' onClick={deleteEntry}>
                            Delete
                        </button>
                    </footer>
                </article>

            </dialog>
            <ToastContainer />
        </Box>
    );
}