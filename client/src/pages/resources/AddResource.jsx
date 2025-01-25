import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid2 as Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddResource() {
    const navigate = useNavigate();
    const [rtOptions, setRtOptions] = useState([]);
    const [rtDesc, setRtDesc] = useState('not selected');

    const getRTs = () => {
        http.get("/resourcetype").then((res) => {
            setRtOptions(res.data);
        });
    };
    useEffect(() => {
        getRTs();
    }, []);

    const formik = useFormik({
        initialValues: {
            resourceName: "",
            resourceDescription: "",
            resourceTypeId: 0,
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
            data.resourceTypeId = parseInt(data.resourceTypeId);
            data.resourceDescription = data.resourceDescription.trim();
            data.resourceName = data.resourceName.trim();

            http.post("/resource", data)
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
    };

    return (
        <>
            {rtOptions.length > 0 && (
                <Box sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <h5>Add Resource</h5>
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
                        <button type="submit">
                            Add
                        </button>
                    </Box>

                    <ToastContainer />
                </Box>
            )}
            {rtOptions.length == 0 && (
                <div>
                    <h4 className='pico-color-red-500'>Warning</h4>
                    <p>No resource types have been made. Click <a href="/addresourcetype">here</a> to add a resource type.</p>
                </div>
            )}
        </>

    );
}