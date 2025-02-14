import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import http from "../../http";
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
        <Box sx={{ width: 350, margin: "auto", padding: 4, borderRadius: 3, boxShadow: 3, mt: 5 }}>

            <h5 style={{ mb: 2, textAlign: "center" }}>
                Forgot Password
            </h5>
            <form onSubmit={handleSubmit}>
                <label> Enter your Email
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete='off'
                        required
                    />
                </label>
                <button type="submit">
                    Reset Password
                </button>
            </form>
            <ToastContainer />
        </Box>
    );
}

export default ForgotPassword;
