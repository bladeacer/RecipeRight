import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { CheckCircle } from "@mui/icons-material"; // ✔️ Success icon

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Extract encoded email from the URL
    useEffect(() => {
        const encodedEmail = searchParams.get("email");
        if (encodedEmail) {
            setEmail(encodedEmail);
        } else {
            navigate("/forgotpassword");
        }
    }, [searchParams, navigate]);

    // Password validation
    const validationSchema = yup.object({
        password: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[!@#$%^&*]/, "Password must contain at least one special character")
            .required("Password is required"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const formik = useFormik({
        initialValues: { password: "", confirmPassword: "" },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);

            try {
                await http.post("/user/reset-password", {
                    email, // Backend fetches token
                    newPassword: values.password,
                });

                setLoading(false);
                setSuccess(true);
                setTimeout(() => navigate("/login"), 3000);
            } catch (err) {
                setLoading(false);
                alert("Error resetting password.");
            }
        },
    });

    return (
        <Box sx={{ width: 350, margin: "auto", padding: 4, bgcolor: "white", borderRadius: 3, boxShadow: 3, mt: 5 }}>
            <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
                Reset Password
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100 }}>
                    <CircularProgress />
                </Box>
            ) : success ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100 }}>
                    <CheckCircle sx={{ fontSize: 60, color: "green" }} />
                </Box>
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Enter new password"
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Confirm new password"
                        type="password"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                    <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
                        Change Password
                    </Button>
                </form>
            )}
        </Box>
    );
}

export default ResetPassword;
