import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import http from '../../http';
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
    }, [id, rt]);

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
        <Box sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>

            <h5>Edit Resource Type</h5>
            {
                !loading && !open && (
                    <Box component="form" onSubmit={formik.handleSubmit}>

                        <label>
                            Resource Name
                            <input type="textarea"
                                id='typeName'
                                name="typeName"
                                value={formik.values.typeName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-invalid={formik.touched.typeName && formik.errors.typeName ? 'true' : 'false'}
                                autoComplete='off'
                            />
                            {formik.touched.typeName && formik.errors.typeName && <small>{formik.errors.typeName}</small>}
                        </label>

                        <label>
                            Description
                            <input placeholder='Enter a description'
                                id='resourceTypeDescription'
                                value={formik.values.resourceTypeDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-invalid={formik.touched.resourceTypeDescription && formik.errors.resourceTypeDescription ? 'true' : 'false'}
                                autoComplete='off'
                            />
                            {formik.touched.resourceTypeDescription && formik.errors.resourceTypeDescription && <small>{formik.errors.resourceTypeDescription}</small>}
                        </label>
                        <button type="submit">Update</button>
                        <button onClick={handleOpen} className='pico-background-red-500' style={{ width: '100%' }}>Delete</button>
                    </Box>
                )
            }
            {
                loading && !open && (
                    <span aria-busy="true"> Loading...  </span>
                )
            }
            <dialog open={open} onClose={handleClose}>
                <article>
                    <header>
                        <h5> Delete Resource Type </h5>
                    </header>
                    <p> Are you sure you want to delete this resource type?  </p>
                    <footer>
                        <button onClick={handleClose}>
                            Cancel
                        </button>
                        <button className='pico-background-red-500' onClick={deleteRt}>
                            Delete
                        </button>
                    </footer>
                </article>

            </dialog>


            <ToastContainer />
        </Box>
    );
}