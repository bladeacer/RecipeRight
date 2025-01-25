import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import http from '../../http';
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
        }).catch(function (err) {
            toast.error(`${err.response.data.message}`);
        });
    }
    useEffect(() => {
        http.get(`/resource/${id}`).then((res) => {
            setRes(res.data);
        });
        getRTs();
        setLoading(false);
    }, [id]);

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

    return (
        <Box>
            <h5>Add Resource</h5>
            {
                !loading && !open && (

                    <Box component="form" onSubmit={formik.handleSubmit}>

                        <label>
                            Resource Type
                            <select type="number"
                                id='resourceTypeId'
                                name='resourceTypeId'
                                value={formik.values.resourceTypeId}
                                onChange={handleResourceTypeChange}
                                onBlur={formik.handleBlur}
                                autoComplete='off'
                            >
                                <option value={0}>Select Resource Type</option>
                                {rtOptions.map((rt) => (
                                    <option key={rt.resourceTypeId} value={rt.resourceTypeId}>
                                        {rt.typeName}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.resourceTypeId && Boolean(formik.errors.resourceTypeId) && <small>{formik.errors.resourceTypeId}</small>}
                        </label>

                        <label>
                            Resource Name
                            <input type="textarea"
                                id='resourceName'
                                name="resourceName"
                                value={formik.values.resourceName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-invalid={formik.touched.resourceName && formik.errors.resourceName ? 'true' : 'false'}
                                autoComplete='off'
                            />
                            {formik.touched.resourceName && formik.errors.resourceName && <small>{formik.errors.resourceName}</small>}
                        </label>
                        <label>
                            Description
                            <input placeholder='Enter a description'
                                id='resourceDescription'
                                value={formik.values.resourceDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-invalid={formik.touched.resourceDescription && formik.errors.resourceDescription ? 'true' : 'false'}
                                autoComplete='off'
                            />
                            {formik.touched.resourceDescription && formik.errors.resourceDescription && <small>{formik.errors.resourceDescription}</small>}
                        </label>
                        <h5>Resource Type Description:
                            <blockquote>
                                {rtDesc}
                            </blockquote>
                        </h5>
                        <Box>
                            <button type="submit">Update</button>
                            <button className='pico-background-red-500' style={{ width: '100%' }} onClick={handleOpen}>
                                Delete
                            </button>
                        </Box>
                    </Box>

                )
            }
            {loading && !open && (
                <span aria-busy="true"> Loading...  </span>
            )}

            <dialog open={open} onClose={handleClose}>
                <article>
                    <header>
                        <h5> Delete Resource </h5>
                    </header>
                    <p> Are you sure you want to delete this resource?  </p>
                    <footer>
                        <button onClick={handleClose}>
                            Cancel
                        </button>
                        <button className='pico-background-red-500' onClick={deleteRes}>
                            Delete
                        </button>
                    </footer>
                </article>

            </dialog>
            <ToastContainer />
        </Box>
    );
}