import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import http from "../http";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [user, setUser] = useState(null);
    const [isTwoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false); // For confirmation dialog
    const [action, setAction] = useState(""); // "enable" or "disable"
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data and 2FA state on component load
        http.get("/user/auth")
            .then((res) => {
                setUser(res.data.user);
                setTwoFactorEnabled(res.data.user.isTwoFactorEnabled); // Sync 2FA state with the database
            })
            .catch((err) => {
                console.error(err);
                navigate("/login");
            });
    }, [navigate]);

    if (!user) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    const handleToggle2FA = async () => {
        try {
            const enable = action === "enable";
            const res = await http.post("/user/enable-2fa", enable, {
                headers: { "Content-Type": "application/json" },
            });
            setTwoFactorEnabled(enable); // Update UI to match database state
            alert(res.data.message); // Display success message
        } catch (error) {
            console.error("Error updating 2FA:", error.response?.data || error);
            alert(error.response?.data?.message || "Failed to update 2FA settings.");
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    textAlign: "center",
                    bgcolor: "white",
                    borderRadius: 4,
                    boxShadow: 3,
                    p: 4,
                }}
            >
                <Avatar
                    alt={user.name}
                    src={user.image || "/default-avatar.png"}
                    sx={{
                        width: 120,
                        height: 120,
                        mx: "auto",
                        mb: 3,
                        boxShadow: 3,
                    }}
                />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {user.name}
                </Typography>
                <Typography variant="body1" sx={{ color: "gray", mb: 2 }}>
                    Email: {user.email}
                </Typography>
                <Typography variant="body1" sx={{ color: "gray", mb: 4 }}>
                    Gender: {user.gender}
                </Typography>

                {/* Enable/Disable 2FA Buttons */}
                {!isTwoFactorEnabled ? (
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#4caf50",
                            color: "white",
                            fontWeight: "bold",
                            mb: 2,
                            "&:hover": {
                                bgcolor: "#388e3c",
                            },
                        }}
                        onClick={() => {
                            setAction("enable");
                            setOpenConfirm(true);
                        }}
                    >
                        Enable 2FA
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#d32f2f",
                            color: "white",
                            fontWeight: "bold",
                            mb: 2,
                            "&:hover": {
                                bgcolor: "#b71c1c",
                            },
                        }}
                        onClick={() => {
                            setAction("disable");
                            setOpenConfirm(true);
                        }}
                    >
                        Disable 2FA
                    </Button>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#2196F3",
                            color: "white",
                            fontWeight: "bold",
                            "&:hover": {
                                bgcolor: "#1976D2",
                            },
                        }}
                        onClick={() => navigate("/edit-profile")}
                    >
                        Edit Profile
                    </Button>

                    {/* Change Security Button */}
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#FFC107",
                            color: "white",
                            fontWeight: "bold",
                            "&:hover": {
                                bgcolor: "#FFA000",
                            },
                        }}
                        onClick={() => navigate("/security")}
                    >
                        Change Security
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#f44336",
                            color: "white",
                            fontWeight: "bold",
                            "&:hover": {
                                bgcolor: "#d32f2f",
                            },
                        }}
                        onClick={() => navigate("/delete-account")}
                    >
                        Delete Account
                    </Button>
                </Box>
            </Box>

            {/* Confirmation Dialog for Enable/Disable 2FA */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>{action === "enable" ? "Enable 2FA" : "Disable 2FA"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to {action === "enable" ? "enable" : "disable"} Two-Factor Authentication?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)} sx={{ color: "#1976d2" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleToggle2FA();
                            setOpenConfirm(false);
                        }}
                        sx={{
                            color: action === "enable" ? "#4caf50" : "#d32f2f",
                        }}
                    >
                        {action === "enable" ? "Enable" : "Disable"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Profile;
