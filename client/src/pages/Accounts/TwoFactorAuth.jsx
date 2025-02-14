import React, { useState, useContext, useEffect } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import http from "../../http";
import UserContext from "../../contexts/UserContext";

function TwoFactorAuth() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const [resendTimer, setResendTimer] = useState(60); // Timer for resend button
    const [resending, setResending] = useState(false); // Loading state for resend button
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const email = searchParams.get("email"); // Extract email from query params

    if (!email) {
        navigate("/login"); // Redirect to login if email is missing
        return null;
    }

    useEffect(() => {
        // Check if timer exists in localStorage (for refresh persistence)
        const storedExpiry = localStorage.getItem("resendTimerExpiry");
        if (storedExpiry) {
            const remainingTime = Math.max(0, Math.floor((storedExpiry - Date.now()) / 1000));
            setResendTimer(remainingTime);
        }

        // Start countdown timer
        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev > 0) {
                    return prev - 1;
                } else {
                    clearInterval(timer);
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await http.post("/user/verify-2fa", { email, code: otp });

            // Save access token to localStorage
            localStorage.setItem("accessToken", res.data.accessToken);

            // Fetch the updated user information
            const authResponse = await http.get("/user/auth", {
                headers: { Authorization: `Bearer ${res.data.accessToken}` },
            });

            // Update the UserContext with the authenticated user
            setUser(authResponse.data.user);

            // Redirect to the pantry
            setLoading(false);
            navigate("/pantry");
        } catch (err) {
            console.error("Error verifying OTP:", err.response?.data || err);
            setLoading(false);
            setError("Invalid OTP. Please try again.");
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return; // Prevent multiple clicks
        setResending(true);
        setError("");

        try {
            await http.post("/user/resend-2fa", { email });
            alert("A new OTP has been sent to your email.");

            // Reset timer and store expiry in localStorage
            localStorage.setItem("resendTimerExpiry", Date.now() + 60000);
            setResendTimer(60);
        } catch (err) {
            console.error("Error resending OTP:", err.response?.data || err);
            setError("Failed to resend OTP. Please try again.");
        } finally {
            setResending(false);
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
                alignItems: "center",
                transition: "opacity 0.5s ease-in-out",
                opacity: loading ? 0.5 : 1,
            }}
        >
            <Box
                sx={{
                    width: 350,
                    borderRadius: 3,
                    p: 4,
                    boxShadow: 3,
                    textAlign: "center",
                }}
            >
                <h5>Two-Factor Authentication</h5>
                <p>Please enter the 6-digit code sent to your email: <strong>{email}</strong></p>

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

                {/* Resend OTP Button with Countdown */}
                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <button
                        className="outlined"
                        onClick={handleResend}
                        disabled={resendTimer > 0 || resending}
                        style={{
                            "&:disabled": {
                                color: "var(--pico-color-gray-300)",
                                borderColor: "gray",
                            },
                        }}
                    >
                        {resending
                            ? "Resending..."
                            : resendTimer > 0
                                ? `Resend OTP in ${resendTimer}s`
                                : "Resend OTP"}
                    </button>
                </Box>
            </Box>
        </Box>
    );
}

export default TwoFactorAuth;
