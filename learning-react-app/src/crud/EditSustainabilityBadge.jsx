import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function EditSustainabilityBadge() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [badge, setBadge] = useState({ badgeName: "", badgeDescription: "", awardedOn: "" });

    useEffect(() => {
        http.get(`/sustainabilityBadge/${id}`).then((res) => setBadge(res.data));
    }, []);

    const formik = useFormik({
        initialValues: badge,
        enableReinitialize: true,
        validationSchema: yup.object({
            badgeName: yup.string().trim().min(3).max(100).required(),
            badgeDescription: yup.string().trim().min(3).max(500).required(),
            awardedOn: yup.date().required(),
        }),
        onSubmit: (data) => {
            http.put(`/sustainabilityBadge/${id}`, data).then(() => navigate("/sustainability-badges"));
        },
    });

    return (
        <Box>
            <Typography variant="h5">Edit Sustainability Badge</Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField fullWidth margin="dense" label="Badge Name" name="badgeName"
                    value={formik.values.badgeName} onChange={formik.handleChange} />
                <TextField fullWidth margin="dense" multiline minRows={2} label="Description" name="badgeDescription"
                    value={formik.values.badgeDescription} onChange={formik.handleChange} />
                <TextField fullWidth margin="dense" type="datetime-local" label="Award Date" name="awardedOn"
                    value={formik.values.awardedOn} onChange={formik.handleChange} InputLabelProps={{ shrink: true }} />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">Update</Button>
                </Box>
            </form>
        </Box>
    );
}
