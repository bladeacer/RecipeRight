import { useState } from "react";
import { Box } from "@mui/material";
import { CheckCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../http";
import ReCAPTCHA from "react-google-recaptcha";

function Register() {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [attributes, setAttributes] = useState([]);
    const [isExistsAdmin, setIsExistsAdmin] = useState(false);
    const [users, setUser] = useState([]);
    const [passwordStrength, setPasswordStrength] = useState({ color: "red", text: "Weak", width: "25%" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const getUsers = () => {
        http.get("/user").then((res) => {
            console.log(res.data);
            setUser(res.data);
        })
    }


    const getAttributes = () => {
        http.get("/attributes").then((res) => {
            setAttributes(res.data);
        });
    };
    const genderOptions = {
        1: { gender: "Male" },
        2: { gender: "Female" },
        3: { gender: "Other" }
    }


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

            getAttributes();
            // Make the first user admin :)
            if (attributes.length == 0) {
                http.get("/userattributes/attr?attribute=admin").then((res) => {
                    setIsExistsAdmin(Object.keys(res.data).length == 0);
                });
                if (!isExistsAdmin) {
                    var default_attr = {
                        attributeName: "admin group",
                        attributeDescription: "users who have admin"
                    }

                    http.post("/attributes", default_attr);
                    var default_user_attr = {
                        userAttributeName: "admin",
                        userAttributeDescription: "let users have admin",
                        attributeId: 1,
                        userId: 1
                    }
                    http.post("/userattributes", default_user_attr);
                    var default_attr2 = {
                        attributeName: "view report group",
                        attributeDescription: "users who can view report"
                    }

                    http.post("/attributes", default_attr2);
                    var default_user_attr2 = {
                        userAttributeName: "view_report",
                        userAttributeDescription: "let users view report",
                        attributeId: 2,
                        userId: 1
                    }
                    http.post("/userattributes", default_user_attr2);
                }
            }

            http.post("/user/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(() => {
                    setLoading(false);
                    setSuccess(true);
                    setFadeOut(true);
                    navigate("/login");
                })
                .catch(() => {
                    setLoading(false);
                    alert("Registration failed. Please try again.");
                });
        },
    });
    const checkPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;

        if (score === 1) {
            setPasswordStrength({ color: "red", text: "Weak", width: "25%" });
        } else if (score === 2) {
            setPasswordStrength({ color: "orange", text: "Medium", width: "50%" });
        } else if (score === 3) {
            setPasswordStrength({ color: "green", text: "Strong", width: "75%" });
        } else if (score === 4) {
            setPasswordStrength({ color: "darkgreen", text: "Very Strong", width: "100%" });
        } else {
            setPasswordStrength({ color: "red", text: "Weak", width: "25%" });
        }
    };

    const handlePasswordChange = (e) => {
        formik.handleChange(e);
        checkPasswordStrength(e.target.value);
    };
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
                display: "flex",
                justifyContent: "center",
                opacity: fadeOut ? 0 : 1,
                alignItems: "center",
            }} >
            <Box
                sx={{
                    width: 920,
                    borderRadius: 4,
                    p: 4,
                    textAlign: "center",
                }}
            >
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 150 }}>
                        <progress />
                    </Box>
                ) : success ? (
                    <Box sx={{ textAlign: "center", minHeight: 150 }}>
                        <CheckCircle className="pico-color-green-500" sx={{ fontSize: 60 }} />
                        <h6 style={{ fontWeight: "bold" }} className="pico-color-green-500">
                            Success! Welcome to RecipeRight 🎉
                        </h6>
                    </Box>
                ) : (
                    <>
                        <h5 style={{ fontWeight: "bold" }}>Registration</h5>

                        <Box component="form" onSubmit={formik.handleSubmit} style={{ textAlign: "left" }}>
                            <div className="grid">
                                <div>
                                    <label> Enter your name
                                        <input
                                            type="text"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={formik.touched.name && formik.errors.name ? 'error' : ''}
                                            aria-invalid={formik.touched.name && formik.errors.name ? 'true' : 'false'}
                                            autoComplete='off'
                                        />
                                        {formik.touched.name && formik.errors.name && <small>{formik.errors.name}</small>}
                                    </label>


                                    <label> Enter your Email
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

                                    <label> Create a Password
                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <input
                                                type={showPassword ? "text" : "password"}  // Toggle visibility
                                                name="password"
                                                value={formik.values.password}
                                                onChange={handlePasswordChange}
                                                onBlur={formik.handleBlur}
                                                className={formik.touched.password && formik.errors.password ? 'error' : ''}
                                                aria-invalid={formik.touched.password && formik.errors.password ? 'true' : 'false'}
                                                autoComplete="off"
                                                style={{ flex: 1, paddingRight: "35px" }}  // Space for the toggle button
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}  // Toggle state
                                                style={{
                                                    position: "absolute",
                                                    right: "25px",
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

                                    <div style={{
                                        height: "8px",
                                        width: "100%",
                                        backgroundColor: "#ddd",
                                        borderRadius: "5px",
                                        marginTop: "5px",
                                        position: "relative"
                                    }}>
                                        <div style={{
                                            height: "100%",
                                            width: passwordStrength.width,
                                            backgroundColor: passwordStrength.color,
                                            borderRadius: "5px",
                                            transition: "width 0.3s ease-in-out"
                                        }}></div>
                                    </div>
                                    <p style={{ color: passwordStrength.color, fontWeight: "bold", fontSize: "14px", marginTop: "5px" }}>
                                        {passwordStrength.text}
                                    </p>

                                    <label> Confirm Password
                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}  // Toggle visibility
                                                name="confirmPassword"
                                                value={formik.values.confirmPassword}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
                                                aria-invalid={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'true' : 'false'}
                                                autoComplete="off"
                                                style={{ flex: 1, paddingRight: "35px" }}  // Space for the toggle button
                                            />

                                            
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}  // Toggle state
                                                style={{
                                                    position: "absolute",
                                                    right: "25px",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    fontSize: "14px",
                                                    color: "#333",
                                                }}
                                            >
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />} {/* Eye icons */}
                                            </button>
                                        </div>
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword && <small>{formik.errors.confirmPassword}</small>}
                                    </label>


                                    <label> Gender
                                        <select
                                            id='gender'
                                            name='gender'
                                            value={formik.values.gender}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            autoComplete='off'
                                        >
                                            <option value="">Select Gender</option>
                                            {Object.keys(genderOptions).map((key) => (
                                                <option key={key} value={genderOptions[key].gender}>
                                                    {genderOptions[key].gender}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.touched.gender && Boolean(formik.errors.gender) && <small>{formik.errors.gender}</small>}
                                    </label>
                                </div>


                                <div style={{ marginLeft: 35, my: 10 }}>
                                    {imagePreview && (
                                        <>
                                            <h6>Image Preview </h6>
                                            <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", mt: 8, mb: 4, borderRadius: 4 }} />
                                        </>
                                    )}
                                    <button className="secondary" style={{ marginTop: 35 }}>
                                        <label>
                                            Upload Image
                                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </button>



                                    <footer style={{ marginTop: 2, paddingInline: 1.5 }}>
                                        Already have an account?&nbsp;
                                        <a href="/login" className="pico-color-indigo-600" style={{ cursor: 'pointer', textDecoration: 'underline' }}>Login Now</a>
                                    </footer>

                                    <Box sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "left" }}>
                                        <ReCAPTCHA sitekey="6Ld9XcsqAAAAAHX1FrqvObDxjGc9_ooQMi2gkebU" onChange={(value) => setCaptchaToken(value)} />
                                    </Box>
                                    <button type="submit">Register Now</button>
                                </div>
                            </div>

                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default Register;
