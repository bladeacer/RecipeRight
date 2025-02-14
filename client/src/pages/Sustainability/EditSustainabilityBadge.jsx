import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function EditSustainabilityBadge() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [badge, setBadge] = useState({ badgeName: "", badgeDescription: "", awardedOn: "" });

    useEffect(() => {
        http.get(`/sustainabilityBadge/${id}`).then((res) => setBadge(res.data));
    }, [id]);

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
            <h5>Edit Sustainability Badge</h5>
            <form onSubmit={formik.handleSubmit}>
                <input label="Badge Name" name="badgeName"
                    value={formik.values.badgeName} onChange={formik.handleChange} />
                <input type='textarea' label="Description" name="badgeDescription"
                    value={formik.values.badgeDescription} onChange={formik.handleChange} />
                <input type="datetime-local" label="Award Date" name="awardedOn"
                    value={formik.values.awardedOn} onChange={formik.handleChange} />
                <button type="submit">Update</button>
            </form>
        </Box>
    );
}
