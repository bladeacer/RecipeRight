import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid2 as Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddPolicy() {
    const navigate = useNavigate();
    const [resOptions, setResOptions] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [resDesc, setResDesc] = useState('not selected');

    const getRes = () => {
        http.get("/resource").then((res) => {
            setResOptions(res.data);
            console.log(res.data);
        });
    };
    const getAttributes = () => {
        http.get("/attributes").then((res) => {
            setAttributes(res.data);
        });
    };

    useEffect(() => {
        getRes();
        getAttributes();
    }, []);

    const formik = useFormik({
        initialValues: {
            policiesName: "",
            policiesDescription: "",
            resourceId: 0,
            requiredAttributes: []
        },
        validationSchema: yup.object({
            policiesName: yup.string().trim()
                .min(3, 'Policy must be at least 3 characters')
                .max(100, 'Policy must be at most 100 characters')
                .required('Policy is required'),
            policiesDescription: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            resourceId: yup.number()
                .min(1, 'Please select a valid Resource Type')
                .required('Resource is required'),
            requiredAttributes: yup.array.of(
                yup.object().shape({
                    attributesId: yup.number.required(),
                    attributesName: yup.string()
                }).required().min(1, "At least one attribute is required")
            )
        }),
        onSubmit: (data) => {
            data.resourceId = parseInt(data.resourceId);
            data.policiesDescription = data.policiesDescription.trim();
            data.policiesName = data.policiesName.trim();
            http.post("/policy", data).then((res) => {
                console.log(res.data);
                navigate("/policies")
            }).catch(function (err) {
                toast.error(`${err.response.data.message}`)
            });
        }
    });
    const handleResourceChange = (event) => {
        const selectedResourceId = event.target.value;
        formik.setFieldValue('resourceId', selectedResourceId);

        const selectedResource = resOptions.find(res => res.resourceId == parseInt(selectedResourceId));
        if (selectedResource) {
            setResDesc(selectedResource.resourceDescription);
        } else {
            setResDesc('not selected')
        }
    };
    const handleChangeAttr = (event) => {
        const selectedAttributeId = event.target.value;
        const isInList = formik.values.requiredAttributes.includes(selectedAttributeId);
        const selectedAttribute = attributes.find(attr => attr.attributesId == parseInt(selectedAttributeId));
        if (isInList && selectedAttribute) {
            formik.setFieldValue('requiredAttributes', formik.values.requiredAttributes.filter(attr => attr.attributesId !== parseInt(selectedAttributeId)))
        }
        else if (!isInList && selectedAttribute){
            formik.setFieldValue('requiredAttributes', formik.values.requiredAttributes.push(
                { attributesId: selectedAttribute.attributesId, attributesName: selectedAttribute.attributesName }
            ))
        }
    }

    return (
        <>
            {resOptions.length > 0 && attributes.length > 0 && (

                <Box sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <h5>Add Resource</h5>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <label>
                            Resource
                            <select type="number"
                                id='resourceId'
                                name='resourceId'
                                value={formik.values.resourceId}
                                onChange={handleResourceChange}
                                onBlur={formik.handleBlur}
                                autoComplete='off'
                            >
                                <option value={0}>Select Resource Type</option>
                                {resOptions.map((rt) => (
                                    <option key={rt.resourceId} value={rt.resourceId}>
                                        {rt.resourceName}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.resourceId && Boolean(formik.errors.resourceId) && <small>{formik.errors.resourceId}</small>}
                        </label>
                        <label>
                            Policy Name
                            <input type="textarea"
                                id='policiesName'
                                name="policiesName"
                                value={formik.values.resourceName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-invalid={formik.touched.policiesName && formik.errors.policiesName ? 'true' : 'false'}
                                autoComplete='off'
                            />
                            {formik.touched.policiesName && formik.errors.policiesName && <small>{formik.errors.policiesName}</small>}
                        </label>
                        <label>
                            Description
                            <input placeholder='Enter a description'
                                id='policiesDescription'
                                value={formik.values.policiesDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-invalid={formik.touched.policiesDescription && formik.errors.policiesDescription ? 'true' : 'false'}
                                autoComplete='off'
                            />
                            {formik.touched.policiesDescription && formik.errors.policiesDescription && <small>{formik.errors.policiesDescription}</small>}
                        </label>
                        <label>
                            Required Attributes
                            {attributes.map((attribute) => (
                                <div key={attribute.attributesId}>
                                    <input
                                        type="checkbox"
                                        id={`attribute-${attribute.attributesId}`}
                                        name="requiredAttributes"
                                        value={attribute.attributesId}
                                        onChange={handleChangeAttr}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.requiredAttributes.includes(attribute.attributesId)}
                                    />
                                    <label htmlFor={`attribute-${attribute.attributesId}`}>{attribute.attributesName}</label>
                                </div>
                            ))}
                            {formik.touched.requiredAttributes && formik.errors.requiredAttributes && <small>{formik.errors.requiredAttributes}</small>}
                        </label>
                        <h5>Resource Description:
                            <blockquote>
                                {resDesc}
                            </blockquote>
                        </h5>
                        <button type="submit">
                            Add
                        </button>
                    </Box>
                    <ToastContainer />
                </Box>
            )}
            {resOptions.length == 0 && (
                <div>
                    <h4 className='pico-color-red-500'>Warning</h4>
                    <p>No resources have been made. Click <a href="/addresource">here</a> to add a resource.</p>
                </div>
            )}
            {attributes.length == 0 && (
                <div>
                    <h4 className='pico-color-red-500'>Warning</h4>
                    <p>No attributes have been made. Click <a href="/addattribute">here</a> to add an attribute.</p>
                </div>
            )}
        </>
    );
}