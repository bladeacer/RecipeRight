import { useEffect, useState } from "react";
import {
    Box,
    Avatar,
} from "@mui/material";
import http from "../../http";
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
                <h3 aria-busy="true"> Loading...</h3>
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
        <>
            {!openConfirm && (
                <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 450,
                            textAlign: "center",
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
                        <h5 style={{ mb: 2 }}>{user.name}</h5>
                        <p style={{ mb: 2 }} className="pico-color-zinc-300">Email: {user.email}</p>
                        <p style={{ mb: 4 }} className="pico-color-zinc-300">Gender: {user.gender}</p>

                        {/* Enable/Disable 2FA Buttons */}
                        {!isTwoFactorEnabled ? (
                            <button className="outline secondary"
                                onClick={() => {
                                    setAction("enable");
                                    setOpenConfirm(true);
                                }}
                            >Enable 2FA
                            </button>

                        ) : (
                            <button className="outline pico-background-azure-250"
                                onClick={() => {
                                    setAction("disable");
                                    setOpenConfirm(true);
                                }}>Disable 2FA
                            </button>
                        )}

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <button className="pico-background-azure-500"
                                onClick={() => navigate("/change-password")}>
                                Change Password
                            </button>

                            {/* Change Security Button */}
                            <button className="pico-color-slate-450" onClick={() => navigate("/security")}>
                                Change Security
                            </button>
                            <button className="pico-color-orange-450" onClick={() => navigate("/delete-account")}>
                                Delete Account
                            </button>

                        </Box>
                    </Box>


                </Box>
            )}
            {openConfirm && (
                <dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                    <article>
                        <header>
                            <h5>{action === "enable" ? "Enable 2FA" : "Disable 2FA"}</h5>
                        </header>
                        <p>Are you sure you want to {action === "enable" ? "pico-color-green-500" : "pico-color-red-500"} Two-Factor Authentication?</p>
                        <footer>
                            <button onClick={() => setOpenConfirm(false)}>Cancel</button>
                            <button className={action === "enable" ? "pico-background-azure-500" : "pico-background-red-500"} onClick={
                                handleToggle2FA() && setOpenConfirm(false)
                            }>
                                {action === "enable" ? "Enable" : "Disable"}
                            </button>
                        </footer>
                    </article>
                </dialog>
            )}
        </>

    );
}

export default Profile;
