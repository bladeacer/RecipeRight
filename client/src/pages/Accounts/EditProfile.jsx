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
                sx={{ alignSelf: 'flex-start', mb: 2, color: "var(--pico-background-white-500)" }} >
                <ArrowBack sx={{mt: 0.5}}/> Back 
            </IconButton>
            <Avatar
                alt={user.name}
                src={imagePreview || '/default-avatar.png'}
                sx={{ width: 100, height: 100 }}
            />
            <button className="secondary" style={{ mt: 2 }}>
                <label>
                    Upload Image
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </label>
            </button>

            <label> Enter your name
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={user.name}
                    onChange={handleInputChange}
                    autoComplete='off'
                />
            </label>
            <label> Enter your gender
                <input
                    type="text"
                    id="gender"
                    value={user.gender}
                    onChange={handleInputChange}
                    autoComplete='off'
                />
            </label>

            <button type="submit">Save changes</button>
        </Box>
    );
}

export default EditProfile;
