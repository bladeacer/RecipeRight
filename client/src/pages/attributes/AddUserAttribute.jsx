import { useEffect, useState } from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
export default function AddUserAttribute() {
    const [attributes, setAttributes] = useState([]);
    const [users, setUser] = useState([]);
    const navigate = useNavigate();
    const getAttributes = () => {
        http.get("/attributes").then((res) => {
            setAttributes(res.data);
        });
    };
    const getUsers = () => {
        http.get("/user").then((res) => {
            console.log(res.data);
            setUser(res.data);
        })
    }
    useEffect(() => {
        getAttributes();
        getUsers();
    }, []);
    const formik = useFormik({
        initialValues: {
            userAttributeName: "",
            userAttributeDescription: "",
            attributeId: 0,
            userId: 0
        },
        validationSchema: yup.object({
            userAttributeName: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(100, 'Name must be at most 100 characters')
                .required('Name is required'),
            userAttributeDescription: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            attributeId: yup.number().min(1, 'Please select a valid attribute Id')
                .required('Attribute is required'),
            userId: yup.number().min(1, 'Please select a valid user')
                .required('User is required'),
        }),
        onSubmit: (data) => {
            data.userAttributeName = data.userAttributeName.trim();
            data.userAttributeDescription = data.userAttributeDescription.trim();

            http.post("/userattributes", data).then((res) => {
                console.log(res.data);
                navigate("/userattributes");
            })
        }
    });

    return (
        <>
            {attributes.length > 0 && (
                <Box sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <h5>Add User Attribute</h5>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <label>
                           User 
                            <select type="number"
                                id='userId'
                                name='userId'
                                value={formik.values.userId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                autoComplete='off'
                            >
                                <option value={0}>Select User</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.userId && Boolean(formik.errors.userId) && <small>{formik.errors.userId}</small>}
                        </label>
                        <label>
                           Attribute 
                            <select type="number"
                                id='attributeId'
                                name='attributeId'
                                value={formik.values.attributeId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                autoComplete='off'
                            >
                                <option value={0}>Select Attribute</option>
                                {attributes.map((attr) => (
                                    <option key={attr.attributesId} value={attr.attributesId}>
                                        {attr.attributeName}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.attributeId && Boolean(formik.errors.attributeId) && <small>{formik.errors.attributeId}</small>}
                        </label>
                        <label>
                            Name
                            <input placeholder='Enter a Name'
                                id='userAttributeName'
                                value={formik.values.userAttributeName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-invalid={formik.touched.userAttributeName && formik.errors.userAttributeName ? 'true' : 'false'}
                                autoComplete='off'
                            />
                            {formik.touched.userAttributeName && formik.errors.userAttributeName && <small>{formik.errors.userAttributeName}</small>}
                        </label>
                        <label>
                            Description
                            <input placeholder='Enter a description'
                                id='userAttributeDescription'
                                value={formik.values.userAttributeDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-invalid={formik.touched.userAttributeDescription && formik.errors.userAttributeDescription ? 'true' : 'false'}
                                autoComplete='off'
                            />
                            {formik.touched.userAttributeDescription && formik.errors.userAttributeDescription && <small>{formik.errors.userAttributeDescription}</small>}
                        </label>
                        <button type="submit">Add</button>
                    </Box>
                </Box>
            )}
            {attributes.length == 0 && (
                <div>
                    <h4 className='pico-color-red-500'>Warning</h4>
                    <p>No attributes have been made. Click <a href="/addattribute">here</a> to add an attribute.</p>
                </div>
            )}
        </>
    )
}