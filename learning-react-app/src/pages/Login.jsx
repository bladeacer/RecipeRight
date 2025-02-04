import React, { useContext, useState } from "react";
import { Box, Typography, TextField, Button, FormControlLabel, Checkbox, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import UserContext from "../contexts/UserContext";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [loading, setLoading] = useState(false); // 🔹 State for loading animation

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: yup.object({
            email: yup
                .string()
                .trim()
                .email("Enter a valid email")
                .max(50, "Email must be at most 50 characters")
                .required("Email is required"),
            password: yup
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters")
                .max(50, "Password must be at most 50 characters")
                .required("Password is required"),
        }),
        onSubmit: (data) => {
            if (!captchaToken) {
                alert("Please complete the reCAPTCHA.");
                return;
            }

            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            data.recaptchaToken = captchaToken;

            setLoading(true); // 🔹 Show loading spinner

            http.post("/user/login", data)
                .then((res) => {
                    const { user, accessToken } = res.data;

                    // Store token and user in context/local storage
                    localStorage.setItem("accessToken", accessToken);
                    setUser(user);

                    setTimeout(() => {
                        setLoading(false); // Hide spinner after delay
                        navigate(user.role === "Admin" ? "/admin/dashboard" : "/tutorials"); // Redirect based on role
                    }, 2000); // 🔹 Simulated delay for smooth transition
                })
                .catch(() => {
                    setLoading(false);
                    alert("Invalid email or password.");
                });
        },
    });

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
                alignItems: "center",
                transition: "opacity 0.5s ease-in-out", // 🔹 Smooth fade transition
                opacity: loading ? 0.5 : 1, // Reduce opacity during loading
            }}
        >
            <Box
                sx={{
                    width: 350,
                    bgcolor: "white",
                    borderRadius: 3,
                    p: 4,
                    boxShadow: 3,
                    textAlign: "center",
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={2}>
                    Login
                </Typography>

                {loading ? (
                    // 🔹 Show spinner while loading
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100 }}>
                        <CircularProgress sx={{ color: "#4169E1" }} />
                    </Box>
                ) : (
                    // 🔹 Show login form when not loading
                    <Box component="form" onSubmit={formik.handleSubmit}>
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
                            label="Enter your password"
                            name="password"
                            type="password"
                            autoComplete="off"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                            <FormControlLabel control={<Checkbox />} label="Remember me" />
                            <Typography
                                variant="body2"
                                sx={{ color: "#4169E1", cursor: "pointer", textDecoration: "underline" }}
                                onClick={() => navigate("/forgotpassword")}
                            >
                                Forgot password?
                            </Typography>
                        </Box>

                        {/* ReCAPTCHA widget */}
                        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                            <ReCAPTCHA
                                sitekey="6Ld9XcsqAAAAAHX1FrqvObDxjGc9_ooQMi2gkebU"
                                onChange={(value) => setCaptchaToken(value)}
                            />
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{
                                mt: 2,
                                bgcolor: "#4169E1",
                                py: 1.4,
                                "&:hover": {
                                    bgcolor: "#2950A8",
                                },
                            }}
                            disabled={loading} // 🔹 Disable button while loading
                        >
                            Login Now
                        </Button>

                        <Typography variant="body2" sx={{ mt: 2}} >
                            Don't have an account?{" "}
                            <Typography
                                component="span"
                                sx={{ color: "#4169E1", cursor: "pointer", textDecoration: "underline" }}
                                onClick={() => navigate("/register")}
                            >
                                Signup now
                            </Typography>
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default Login;
