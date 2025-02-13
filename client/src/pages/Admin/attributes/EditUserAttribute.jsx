import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import http from '../../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Error from '../../Others/Error';
export default function EditUserAttribute() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [attributes, setAttributes] = useState([]);
    const [users, setUser] = useState([]);
    const [isAllowedEdit, setIsAllowedEdit] = useState(false);
    const [attr, setAttr] = useState({
        userAttributesId: 0,
        userAttributeName: "",
        userAttributeDescription: "",
        attributeId: 0,
        userId: 0,
        createdAt: "",
        updatedAt: ""
    });
    const [loading, setLoading] = useState(true);
    const getAttributes = () => {
        http.get("/attributes").then((res) => {
            setAttributes(res.data);
        });
    };
    const getUsers = () => {
        http.get("/user").then((res) => {
            setUser(res.data);
        })
    }
    useEffect(() => {
        getAttributes();
        getUsers();
        http.get(`/userattributes/${id}`).then((res) => {
            setAttr(res.data);
            setLoading(false);
        });
        http.get("/userattributes/attr?attribute=admin").then((res) => {
            setIsAllowedEdit(res.data);
        });
    }, [id, attr]);
    const formik = useFormik({
        initialValues: attr,
        enableReinitialize: true,
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
            userId: yup.number()
                .min(1, 'Please select a valid user')
                .required('User is required'),
        }),
        onSubmit: (data) => {
            http.put(`/userattributes/${id}`, data).then((res) => {
                console.log(res.data);
                navigate("/userattributes");
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
    const deleteUserAttr = () => {
        http.delete(`/userattributes/${id}`).then((res) => {
            console.log(res.data);
            navigate("/userattributes")
        }).catch(function (err) {
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
            {!loading && !open 
            && isAllowedEdit 
            && (
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
                    <button type="submit">Update</button>
                    <button onClick={handleOpen} className='pico-background-red-500' style={{ width: '100%' }}>Delete</button>
                </Box>
            )}
            {loading && !open 
            && isAllowedEdit
             && (
                <h3 aria-busy="true"> Loading ...</h3>
            )}
            {isAllowedEdit && (

                <dialog open={open} onClose={handleClose}>
                    <article>
                        <header>
                            <h5> Delete User Attribute</h5>
                        </header>
                        <p> Are you sure you want to delete this user attribute?  </p>
                        <footer>
                            <button onClick={handleClose}>
                                Cancel
                            </button>
                            <button className='pico-background-red-500' onClick={deleteUserAttr}>
                                Delete
                            </button>
                        </footer>
                    </article>

                </dialog>
            )}
            {!isAllowedEdit && (
                <Error />
            )}
        </Box>
    )

}