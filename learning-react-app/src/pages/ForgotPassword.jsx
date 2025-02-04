import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await http.post("/user/forgot-password", { email });
            toast.success(response.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <Box sx={{ width: 350, margin: "auto", padding: 4, bgcolor: "white", borderRadius: 3, boxShadow: 3, mt: 5 }}>
            <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
                Forgot Password
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    sx={{ mt: 2, bgcolor: "#4169E1", py: 1.4, "&:hover": { bgcolor: "#2950A8" } }}
                >
                    Reset Password
                </Button>
            </form>
            <ToastContainer />
        </Box>
    );
}

export default ForgotPassword;
