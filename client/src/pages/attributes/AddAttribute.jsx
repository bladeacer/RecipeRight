import { useFormik } from "formik";
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Box } from "@mui/material";


export default function AddAttribute() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            attributeName: "",
            attributeDescription: ""
        },
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
            http.post("/attributes", data).then((res) => {
                console.log(res.data);
                navigate("/attributes");
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
            <h5>Add Attribute</h5>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <label>
                    Attribute Name
                    <input placeholder='Enter an attribute name'
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
                    <textarea placeholder='Enter a description'
                        id='attributeDescription'
                        name="attributeDescription"
                        value={formik.values.attributeDescription}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        aria-invalid={formik.touched.attributeDescription && formik.errors.attributeDescription ? 'true' : 'false'}
                        autoComplete='off'
                    />
                    {formik.touched.attributeDescription && formik.errors.attributeDescription && <small>{formik.errors.attributeDescription}</small>}
                </label>
                <button type="submit">Add </button>
            </Box>
            <ToastContainer />
        </Box>
    )
}