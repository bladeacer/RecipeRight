import React, { useState } from "react";
import {
    Box, Typography, TextField, Button, MenuItem, Checkbox, FormControlLabel, CircularProgress
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material"; 
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import ReCAPTCHA from "react-google-recaptcha";

function Register() {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fadeOut, setFadeOut] = useState(false); 

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "",
            image: null,
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, "Name must be at least 3 characters")
                .max(50, "Name must be at most 50 characters")
                .required("Name is required")
                .matches(/^[a-zA-Z '-,.]+$/, "Only letters, spaces, and characters: ' - , ."),
            email: yup.string().trim()
                .email("Enter a valid email")
                .max(50, "Email must be at most 50 characters")
                .required("Email is required"),
            password: yup.string().trim()
                .min(8, "Password must be at least 8 characters")
                .matches(/[0-9]/, "Password must contain at least one number")
                .matches(/[!@#$%^&*]/, "Password must contain at least one special character")
                .required("Password is required"),
            confirmPassword: yup.string().trim()
                .oneOf([yup.ref("password")], "Passwords must match")
                .required("Confirm password is required"),
            gender: yup.string().required("Gender is required"),
            image: yup.mixed().required("Image is required"),
        }),
        onSubmit: (data) => {
            if (!captchaToken) {
                alert("Please complete the reCAPTCHA.");
                return;
            }

            setLoading(true);

            const formData = new FormData();
            formData.append("name", data.name.trim());
            formData.append("email", data.email.trim().toLowerCase());
            formData.append("password", data.password.trim());
            formData.append("gender", data.gender);
            formData.append("image", data.image);
            formData.append("recaptchaToken", captchaToken);

            http.post("/user/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(() => {
                    setTimeout(() => {
                        setLoading(false);
                        setSuccess(true);
                    }, 1500); 
                    setTimeout(() => {
                        setFadeOut(true);
                    }, 3000);
                    setTimeout(() => navigate("/login"), 4000); 
                })
                .catch(() => {
                    setLoading(false);
                    alert("Registration failed. Please try again.");
                });
        },
    });

    const handleImageChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            formik.setFieldValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box
            sx={{
                position: "absolute",
                top: "64px",
                left: 0,
                width: "100%",
                height: "calc(100vh - 64px)",
                backgroundColor: "#6495ED",
                display: "flex",
                justifyContent: "center",
                opacity: fadeOut ? 0 : 1,
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: 400,
                    bgcolor: "white",
                    borderRadius: 4,
                    boxShadow: 3,
                    p: 4,
                    textAlign: "center",
                }}
            >
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 150 }}>
                        <CircularProgress sx={{ color: "#4169E1" }} />
                    </Box>
                ) : success ? (
                    <Box sx={{ textAlign: "center", minHeight: 150 }}>
                        <CheckCircle sx={{ fontSize: 60, color: "green" }} />
                        <Typography variant="h6" fontWeight="bold" mt={2} sx={{ color: "green" }}>
                            Success! Welcome to RecipeRight 🎉
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: "#333" }}>
                            Registration
                        </Typography>

                        <Box component="form" onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Enter your name"
                                name="name"
                                autoComplete="off"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Enter your email"
                                name="email"
                                autoComplete="off"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Create a password"
                                name="password"
                                type="password"
                                autoComplete="off"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Confirm password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="off"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                select
                                label="Gender"
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.gender && Boolean(formik.errors.gender)}
                                helperText={formik.touched.gender && formik.errors.gender}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </TextField>

                            {/* Image Upload */}
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                sx={{ mt: 2, py: 1.4, bgcolor: "#4169E1", color: "white" }}
                            >
                                Upload Image
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </Button>

                            {imagePreview && (
                                <Box sx={{ mt: 2 }}>
                                    <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", borderRadius: 4 }} />
                                </Box>
                            )}

                            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                                <ReCAPTCHA sitekey="6Ld9XcsqAAAAAHX1FrqvObDxjGc9_ooQMi2gkebU" onChange={(value) => setCaptchaToken(value)} />
                            </Box>

                            <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, py: 1.5, bgcolor: "#4169E1", color: "white" }}>
                                Register Now
                            </Button>
                            <Typography
                        variant="body2"
                        sx={{ mt: 2, textAlign: 'center', color: '#333' }}
                    >
                        Already have an account?{' '}
                        <Typography
                            component="span"
                            sx={{
                                color: '#4169E1',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Login now
                        </Typography>
                        </Typography>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default Register;
