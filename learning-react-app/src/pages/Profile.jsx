import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import http from '../http';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        http.get(`${import.meta.env.VITE_API_BASE_URL}/user/auth`)
            .then((res) => {
                setUser(res.data.user);
            })
            .catch((err) => {
                console.error(err);
                navigate('/login');
            });
    }, [navigate]);

    if (!user) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    bgcolor: '#f7f7f7',
                }}
            >
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    const imageUrl = user.image ? user.image : '/default-avatar.png';

    const handleDeleteAccount = async () => {
        try {
            await http.delete(`${import.meta.env.VITE_API_BASE_URL}/user/${user.id}`);
            navigate('/login'); // Redirect to login page after account deletion
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                bgcolor: 'linear-gradient(135deg, #f0f4f8, #dfe9f3)',
                py: 4,
                px: 2,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    textAlign: 'center',
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                    p: 4,
                }}
            >
                <Avatar
                    alt={user.name}
                    src={imageUrl}
                    sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {user.name}
                </Typography>
                <Typography variant="body1" sx={{ color: 'gray', mb: 2 }}>
                    Email: {user.email}
                </Typography>
                <Typography variant="body1" sx={{ color: 'gray', mb: 4 }}>
                    Gender: {user.gender}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2, // Add spacing between buttons
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#4caf50',
                            color: 'white',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                                bgcolor: '#388e3c',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                        onClick={() => navigate('/edit-profile')}
                    >
                        Edit Profile
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#2196f3',
                            color: 'white',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                                bgcolor: '#1976d2',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                        onClick={() => navigate('/security')}
                    >
                        Security
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#f44336',
                            color: 'white',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                                bgcolor: '#d32f2f',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                        onClick={() => setOpen(true)}
                    >
                        Delete Account
                    </Button>
                </Box>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} sx={{ color: '#1976d2' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteAccount} sx={{ color: '#f44336' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Profile;
