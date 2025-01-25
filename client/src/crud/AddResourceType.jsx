import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddResourceType() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            typeName: "",
            resourceTypeDescription: ""
        },
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
            http.post("/resourcetype", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/resourcetypes");
                })
        }
    });

    return (
        <Box sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <h5>Add Resource Type</h5>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <label>
                    Resource Name
                    <input placeholder='Enter a resource type name'
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
                <button type="submit"> Add </button>
            </Box>

            <ToastContainer />
        </Box>
    )
}