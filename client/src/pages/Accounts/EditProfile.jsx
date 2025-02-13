import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Avatar, IconButton } from '@mui/material';
import http from '../../http';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
function EditProfile() {
    const [user, setUser] = useState({
        name: '',
        gender: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        http.get('/user/auth')
            .then((res) => {
                setUser(res.data.user);
                setImagePreview(res.data.user.image);
            })
            .catch((err) => {
                console.error(err);
                navigate('/login');
            });
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setUser({ ...user, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('gender', user.gender);
        if (user.image) {
            formData.append('image', user.image);
        }

        http.put(`/user/${user.id}`, formData)
            .then(() => {
                navigate('/profile');
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <IconButton
                onClick={() => navigate(-1)}
                sx={{ alignSelf: 'flex-start', mb: 2 }}
            >
                <ArrowBack />
            </IconButton>
            <Avatar
                alt={user.name}
                src={imagePreview || '/default-avatar.png'}
                sx={{ width: 100, height: 100 }}
            />
            <Button
                variant="contained"
                component="label"
                sx={{ mt: 2 }}
            >
                Upload Image
                <input
                    type="file"
                    hidden
                    onChange={handleImageChange}
                />
            </Button>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={user.name}
                onChange={handleInputChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="gender"
                label="Gender"
                name="gender"
                value={user.gender}
                onChange={handleInputChange}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Save Changes
            </Button>
        </Box>
    );
}

export default EditProfile;
