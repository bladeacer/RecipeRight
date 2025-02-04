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
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false); // 🔹 State for loading
    const [success, setSuccess] = useState(false); // 🔹 State for success animation

    // Extract token from the URL
    useEffect(() => {
        const resetToken = searchParams.get("token");
        if (resetToken) {
            setToken(resetToken);
        } else {
            navigate("/forgotpassword"); // Redirect if no token
        }
    }, [searchParams, navigate]);

    // 🔹 Password Validation Schema
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

    // 🔹 Form Handling
    const formik = useFormik({
        initialValues: { password: "", confirmPassword: "" },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true); // Show spinner

            setTimeout(async () => {
                try {
                    await http.post("/user/reset-password", {
                        token,
                        newPassword: values.password,
                    });

                    setTimeout(() => {
                        setLoading(false);
                        setSuccess(true); // Show ✔️ after processing
                    }, 2000); // Keep loading for 2 more seconds before success

                    setTimeout(() => navigate("/login"), 4000); // Hold checkmark for 2 seconds before redirecting
                } catch (err) {
                    setLoading(false);
                    setSuccess(false);
                }
            }, 2000); // Initial fake delay (2 seconds)
        },
    });

    return (
        <Box sx={{ width: 350, margin: "auto", padding: 4, bgcolor: "white", borderRadius: 3, boxShadow: 3, mt: 5 }}>
            <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
                Reset Password
            </Typography>

            {loading ? (
                // 🔹 Show spinner for at least 4 seconds before checkmark
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100 }}>
                    <CircularProgress />
                </Box>
            ) : success ? (
                // ✅ Show green checkmark after success
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100 }}>
                    <CheckCircle sx={{ fontSize: 60, color: "green" }} />
                </Box>
            ) : (
                // 🔹 Show form when not loading or successful
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
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2, bgcolor: "#4169E1", py: 1.4, "&:hover": { bgcolor: "#2950A8" } }}
                        disabled={loading || success} // Disable button while loading or after success
                    >
                        Change Password
                    </Button>
                </form>
            )}
        </Box>
    );
}

export default ResetPassword;
