import React, { useState, useContext, useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import http from "../../http";
import UserContext from "../../contexts/UserContext";

function TwoFactorAuth() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(1);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [searchParams] = useSearchParams();

    // Retrieve email from URL or fallback to localStorage
    const queryEmail = searchParams.get("email");
    const storedEmail = localStorage.getItem("userEmail");
    const email = queryEmail || storedEmail;

    // Store email if found in URL (prevents loss on refresh)
    useEffect(() => {
        if (queryEmail) {
            localStorage.setItem("userEmail", queryEmail);
        }
    }, [queryEmail]);

    // If email is missing, redirect to login
    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [email, navigate]);

    // Resend OTP Timer Logic
    useEffect(() => {
        const storedExpiry = localStorage.getItem("resendTimerExpiry");
        if (storedExpiry) {
            const remainingTime = Math.max(0, Math.floor((storedExpiry - Date.now()) / 1000));
            setResendTimer(remainingTime);
        }

        const timer = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Handle OTP Verification
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await http.post("/user/verify-2fa", { email, code: otp });

            // Save token & update user context
            localStorage.setItem("accessToken", res.data.accessToken);
            const authResponse = await http.get("/user/auth", {
                headers: { Authorization: `Bearer ${res.data.accessToken}` },
            });

            setUser(authResponse.data.user);
            navigate("/pantry"); // Redirect after successful login
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP Resend
    const handleResend = async () => {
        if (resendTimer > 0 || resending || !email) return;

        setResending(true);
        setError("");

        try {
            const response = await http.post("/user/resend-2fa", { email });

            if (response.status === 200) {
                alert("A new OTP has been sent to your email.");
                localStorage.setItem("resendTimerExpiry", Date.now() + 60000);
                setResendTimer(60);
            }
        } catch (err) {
            setError("Failed to resend OTP. Please try again.");
        } finally {
            setResending(false);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Box sx={{ width: 350, borderRadius: 3, p: 4, boxShadow: 3, textAlign: "center" }}>
                <h5>Two-Factor Authentication</h5>
                <p>Please enter the 6-digit code sent to: <strong>{email || "your email"}</strong></p>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100 }}>
                        <progress />
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit}>
                        <label>
                            <input
                                label="Enter OTP"
                                name="otp"
                                autoComplete="off"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                aria-invalid={Boolean(error)}
                            />
                            <small>{error}</small>
                        </label>
                        <button type="submit" disabled={loading || otp.length !== 6}>
                            Verify
                        </button>
                    </Box>
                )}

                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <button className="outlined" onClick={handleResend} disabled={resendTimer > 0 || resending}>
                        {resending ? "Resending..." : resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                    </button>
                </Box>
            </Box>
        </Box>
    );
}

export default TwoFactorAuth;
