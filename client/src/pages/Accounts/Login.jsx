import { useContext, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../http";
import UserContext from "../../contexts/UserContext";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [attributes, setAttributes] = useState([]);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const getAttributes = () => {
    http.get("/attributes").then((res) => {
        setAttributes(res.data);
    });
};

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
            localStorage.setItem("accessToken", res.data.accessToken);
            if (attributes.length == 0) {

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
            navigate("/pantry");
            window.location.reload(); 
          }
        })
        .catch(() => {
          alert("Invalid email or password.");
        });
    },
  });

  const onGoogleLoginSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    try {
      const res = await http.post("/user/google-login", { token: credential });
      localStorage.setItem("accessToken", res.data.accessToken);
      if (res.data.completeProfile) {
        navigate("/profile");
      } else {
        navigate("/complete-profile");
      }
    } catch (err) {
      console.error("Google login failed", err);
      alert("Google login failed.");
    }
  };

  const onGoogleLoginError = () => {
    console.error("Google login failed");
    alert("Google login failed.");
  };

  return (
    <Box
      sx={{
        marginTop: "6rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 475,
          borderRadius: 3,
          p: 4,
          boxShadow: 3,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <h5>Login</h5>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          style={{ textAlign: "left" }}
        >
          <label>
            Enter your Email
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.email && formik.errors.email ? "error" : ""
              }
              aria-invalid={
                formik.touched.email && formik.errors.email ? "true" : "false"
              }
              autoComplete="off"
            />
            {formik.touched.email && formik.errors.email && (
              <small>{formik.errors.email}</small>
            )}
          </label>

          <label>
            Enter your Password
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.password && formik.errors.password ? "error" : ""
                }
                aria-invalid={
                  formik.touched.password && formik.errors.password ? "true" : "false"
                }
                autoComplete="off"
                style={{ flex: 1, paddingRight: "35px" }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <small>{formik.errors.password}</small>
            )}
          </label>

          <footer
            style={{
              marginBlock: 10,
              paddingInline: 1.5,
              textAlign: "left",
            }}
          >
            Forgot password?&nbsp;
            <a
              href="/forgotpassword"
              style={{ textDecoration: "underline", color: "indigo" }}
            >
              Click here
            </a>
          </footer>

          <Box sx={{ my: 4, display: "flex", justifyContent: "left" }}>
            <ReCAPTCHA
              sitekey="6Ld9XcsqAAAAAHX1FrqvObDxjGc9_ooQMi2gkebU"
              onChange={(value) => setCaptchaToken(value)}
            />
          </Box>
          <button type="submit" style={{ width: "100%" }}>Login</button>
        </Box>

        {/* Google Login Button */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <GoogleLogin
            onSuccess={onGoogleLoginSuccess}
            onError={onGoogleLoginError}
            theme="outline"        // <--- White button with border
            size="large"
            text="signin_with"
            shape="rectangular"
            logo_alignment="left"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
