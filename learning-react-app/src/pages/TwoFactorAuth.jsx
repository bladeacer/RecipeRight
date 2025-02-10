import React, { useState, useContext, useEffect } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import http from "../http";
import UserContext from "../contexts/UserContext";

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
        // Start a countdown timer for the resend button
        const timer = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer on unmount
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
        setResending(true);
        setError("");

        try {
            await http.post("/user/resend-2fa", { email });
            alert("A new OTP has been sent to your email.");
            setResendTimer(60); // Reset the timer
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
                height: "calc(100vh - 64px)",
                backgroundColor: "#6495ED",
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
                    bgcolor: "white",
                    borderRadius: 3,
                    p: 4,
                    boxShadow: 3,
                    textAlign: "center",
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={2}>
                    Two-Factor Authentication
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                    Please enter the 6-digit code sent to your email: <strong>{email}</strong>.
                </Typography>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100 }}>
                        <CircularProgress sx={{ color: "#4169E1" }} />
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Enter OTP"
                            name="otp"
                            autoComplete="off"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            error={Boolean(error)}
                            helperText={error}
                        />
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
                            disabled={loading || otp.length !== 6}
                        >
                            Verify
                        </Button>
                    </Box>
                )}

                {/* Resend OTP Button with Countdown */}
                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Button
                        variant="outlined"
                        onClick={handleResend}
                        disabled={resendTimer > 0 || resending}
                        sx={{
                            "&:disabled": {
                                color: "gray",
                                borderColor: "gray",
                            },
                        }}
                    >
                        {resending
                            ? "Resending..."
                            : resendTimer > 0
                            ? `Resend OTP in ${resendTimer}s`
                            : "Resend OTP"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default TwoFactorAuth;
