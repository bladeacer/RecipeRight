import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../http";
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
                navigate("/login");
            } catch (err) {
                setLoading(false);
                alert("Error resetting password.");
            }
        },
    });

    return (
        <Box sx={{ width: 350, margin: "auto", padding: 4, borderRadius: 3, boxShadow: 3, mt: 5 }}>
            <h5 style={{ mb: 2, textAlign: "center" }}>
                Reset Password
            </h5>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100 }}>
                    <progress />
                </Box>
            ) : success ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100 }}>
                    <CheckCircle className="pico-color-green-500" sx={{ fontSize: 60 }} />
                </Box>
            ) : (
                <form onSubmit={formik.handleSubmit}>

                    <label> Create new Password
                        <input
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={formik.touched.password && formik.errors.password ? 'error' : ''}
                            aria-invalid={formik.touched.password && formik.errors.password ? 'true' : 'false'}
                            autoComplete='off'
                        />
                        {formik.touched.password && formik.errors.password && <small>{formik.errors.password}</small>}
                    </label>

                    <label> Confirm new Password
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
                            aria-invalid={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'true' : 'false'}
                            autoComplete='off'
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && <small>{formik.errors.confirmPassword}</small>}
                    </label>
                    <button type="submit">Change password</button>
                </form>
            )}
        </Box>
    );
}

export default ResetPassword;
