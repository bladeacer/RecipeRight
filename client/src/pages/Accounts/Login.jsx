import { useContext, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../http";
import UserContext from "../../contexts/UserContext";
import ReCAPTCHA from "react-google-recaptcha";


function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

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

            http.post("/user/login", data)
                .then((res) => {
                    if (res.data.requires2FA) {
                        navigate(`/verify-2fa?email=${encodeURIComponent(data.email)}`);
                    } else {
                        // If 2FA is not enabled, log in normally
                        localStorage.setItem("accessToken", res.data.accessToken);
                        navigate("/pantry");
                    }
                })
                .catch(() => {
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "opacity 0.5s ease-in-out",
            }}
        >
            <Box
                sx={{
                    width: 475,
                    borderRadius: 3,
                    p: 4,
                    boxShadow: 3,
                    textAlign: "center",
                }}
            >
                <h5>Login</h5>



                <Box component="form" onSubmit={formik.handleSubmit} style={{ textAlign: 'left' }}>

                    <label>
                        Enter your Email
                        <input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={formik.touched.email && formik.errors.email ? 'error' : ''}
                            aria-invalid={formik.touched.email && formik.errors.email ? 'true' : 'false'}
                            autoComplete='off'
                        />
                        {formik.touched.email && formik.errors.email && <small>{formik.errors.email}</small>}
                    </label>

                    <label>
                        Enter your Password
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <input
                                type={showPassword ? "text" : "password"}  // Toggle visibility
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.password && formik.errors.password ? 'error' : ''}
                                aria-invalid={formik.touched.password && formik.errors.password ? 'true' : 'false'}
                                autoComplete="off"
                                style={{ flex: 1, paddingRight: "35px" }}  // Space for the toggle button
                            />

                            {/* Show/Hide Password Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}  // Toggle state
                                style={{
                                    position: "absolute",
                                    right: "20px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "#333",
                                }}
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />} {/* Eye icons */}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && <small>{formik.errors.password}</small>}
                    </label>


                    <footer style={{ marginBlock: 10, paddingInline: 1.5, textAlign: 'left' }}>
                        Forgot password?&nbsp;
                        <a href="/forgotpassword" className="pico-color-indigo-600" style={{ textDecoration: 'underline' }}>Click here</a>
                    </footer>
                    <Box sx={{ my: 4, display: "flex", justifyContent: "left" }}>
                        <ReCAPTCHA
                            sitekey="6Ld9XcsqAAAAAHX1FrqvObDxjGc9_ooQMi2gkebU"
                            onChange={(value) => setCaptchaToken(value)}
                        />
                    </Box>
                    <button type="submit">
                        Login
                    </button>


                </Box>
            </Box>
        </Box>
    );
}

export default Login;