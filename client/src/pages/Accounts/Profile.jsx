import { useEffect, useState } from "react";
import { Box, Avatar } from "@mui/material";
import http from "../../http";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [user, setUser] = useState(null);
    const [isTwoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        http.get("/user/auth")
            .then((res) => {
                setUser(res.data.user);
                setTwoFactorEnabled(res.data.user.isTwoFactorEnabled);
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

    const handleDeleteAccount = async () => {
        try {
            await http.delete(`/user/${user.id}`); // API call to delete user
            alert("Your account has been deleted successfully.");
            
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login", { replace: true }); // Redirect to login
        } catch (error) {
            console.error("Error deleting account:", error.response?.data || error);
            alert(error.response?.data?.message || "Failed to delete account.");
        }
    };

    return (
        <>
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
                    <h5 style={{ marginBottom: "10px" }}>{user.name}</h5>
                    <p className="pico-color-zinc-300">Email: {user.email}</p>
                    <p className="pico-color-zinc-300">Gender: {user.gender}</p>

                    
                    <button
                        className="outline"
                        style={{
                            backgroundColor: isTwoFactorEnabled ? "#dc3545" : "#28a745",
                            color: "#fff",
                            border: "none",
                            padding: "10px 15px",
                            fontSize: "16px",
                            borderRadius: "5px",
                            marginBottom: "15px",
                            cursor: "pointer"
                        }}
                        onClick={() => {
                            setOpenConfirm(true);
                        }}
                    >
                        {isTwoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                    </button>

                    
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <button className="pico-background-azure-500" onClick={() => navigate("/edit-profile")}>
                            Edit Profile
                        </button>

                        <button className="pico-background-azure-400" style={{ color: "#ffffff", background: "#0056b3" }} onClick={() => navigate("/security")}>
                            Change Security
                        </button>

                        
                        <button
                            style={{
                                backgroundColor: "#dc3545",
                                color: "white",
                                fontWeight: "bold",
                                border: "none",
                                padding: "12px 16px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                width: "100%",
                                maxWidth: "350px",
                                display: "block",
                                margin: "0 auto"
                            }}
                            onClick={() => setOpenDeleteConfirm(true)}
                        >
                            Delete Account
                        </button>
                    </Box>
                </Box>
            </Box>

            {/* DELETE ACCOUNT CONFIRMATION POPUP */}
            {openDeleteConfirm && (
                <dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
                    <article>
                        <header>
                            <h5>Confirm Account Deletion</h5>
                        </header>
                        <p>Are you sure you want to delete your account? This action is irreversible.</p>
                        <footer>
                            <button onClick={() => setOpenDeleteConfirm(false)}>Cancel</button>
                            <button
                                style={{
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 15px",
                                    fontSize: "16px",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                                onClick={handleDeleteAccount}
                            >
                                Confirm Delete
                            </button>
                        </footer>
                    </article>
                </dialog>
            )}
        </>
    );
}

export default Profile;
