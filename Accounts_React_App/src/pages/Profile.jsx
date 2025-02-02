import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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
        return <Typography>Loading...</Typography>;
    }

    const imageUrl = user.image ? user.image : '/default-avatar.png';

    const handleDeleteAccount = async () => {
        try {
            await http.delete(`${import.meta.env.VITE_API_BASE_URL}/user/${user.id}`);
            navigate('/login'); // Redirect to login page after account deletion
        } catch (error) {
            console.error("Error deleting account:", error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Avatar
                alt={user.name}
                src={imageUrl}
                sx={{ width: 100, height: 100 }}
            />
            <Typography variant="h5" sx={{ my: 2 }}>
                {user.name}
            </Typography>
            <Typography variant="body1">
                Email: {user.email}
            </Typography>
            <Typography variant="body1">
                Gender: {user.gender}
            </Typography>
            <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate('/edit-profile')}
            >
                Edit Profile
            </Button>
            <Button
                variant="contained"
                onClick={() => navigate('/security')}
                sx={{ mt: 2 }}
            >
                Security
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={() => setOpen(true)}
                sx={{ mt: 2 }}
            >
                Delete Account
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteAccount} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Profile;
