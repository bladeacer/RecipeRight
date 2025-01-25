import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditAttribute() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [attr, setAttr] = useState({
        attributesId: 0,
        attributeName: "",
        attributeDescription: "",
        createdAt: "",
        updatedAt: ""
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        http.get(`/attributes/${id}`).then((res) => {
            setAttr(res.data);
            setLoading(false);
        }).catch(function(err) {
            toast.error(`${err.response.data.message}`)
        });
    }, [id, attr]);

    const formik = useFormik({
        initialValues: attr,
        enableReinitialize: true,
        validationSchema: yup.object({
            attributeName: yup.string().trim()
                .min(3, 'Type Name must be at least 3 characters')
                .max(100, 'Type Name must be at most 100 characters')
                .required('Type Name is required'),
            attributeDescription: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required')
        }),
        onSubmit: (data) => {
            http.put(`/attributes/${id}`, data).then((res) => {
                console.log(res.data);
                navigate("/attributes");
            }).catch(function (err) {
                toast.error(`${err.response.data.message}`);
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

    const deleteAttr = () => {
        http.delete(`/attributes/${id}`).then((res) => {
            console.log(res.data);
            navigate("/attributes")
        }).catch(function(err) {
            toast.error(`${err.response.data.message}`)
        })
    };

    return (
        <Box sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>

            <h5>Edit Attribute</h5>
            {
                !loading && !open && (
                    <Box component="form" onSubmit={formik.handleSubmit}>

                        <label>
                            Resource Name
                            <input type="textarea"
                                id='attributeName'
                                name="attributeName"
                                value={formik.values.attributeName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-invalid={formik.touched.attributeName && formik.errors.attributeName ? 'true' : 'false'}
                                autoComplete='off'
                            />
                            {formik.touched.attributeName && formik.errors.attributeName && <small>{formik.errors.attributeName}</small>}
                        </label>

                        <label>
                            Description
                            <input placeholder='Enter a description'
                                id='attributeDescription'
                                value={formik.values.attributeDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-invalid={formik.touched.attributeDescription && formik.errors.attributeDescription ? 'true' : 'false'}
                                autoComplete='off'
                            />
                            {formik.touched.attributeDescription && formik.errors.attributeDescription && <small>{formik.errors.attributeDescription}</small>}
                        </label>
                        <button type="submit">Update</button>
                        <button onClick={handleOpen} className='pico-background-red-500' style={{ width: '100%' }}>Delete</button>
                    </Box>
                )
            }
            {
                loading && !open && (
                    <h3 aria-busy="true"> Loading...  </h3>
                )
            }
            <dialog open={open} onClose={handleClose}>
                <article>
                    <header>
                        <h5> Delete Resource Type </h5>
                    </header>
                    <p> Are you sure you want to delete this attribute?  </p>
                    <footer>
                        <button onClick={handleClose}>
                            Cancel
                        </button>
                        <button className='pico-background-red-500' onClick={deleteAttr}>
                            Delete
                        </button>
                    </footer>
                </article>

            </dialog>


            <ToastContainer />
        </Box>
    );
}