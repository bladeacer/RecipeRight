import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccessTime, Search, Clear, Edit, Add } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

export default function FoodWasteLogs() {
    const [wasteList, setWasteList] = useState([]);
    const [search, setSearch] = useState("");
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => setSearch(e.target.value);

    const getWasteEntries = () => {
        http.get("/foodWasteEntry").then((res) => {
            console.log(res.data);  // Add this line
            setWasteList(res.data);
        });
    };

    const searchWasteEntries = () => {
        http.get(`/foodWasteEntry?search=${search}`).then((res) => setWasteList(res.data));
    };

    useEffect(() => {
        getWasteEntries();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") searchWasteEntries();
    };

    const onClickSearch = () => searchWasteEntries();
    const onClickClear = () => {
        setSearch('');
        getWasteEntries();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pt: 1 }}>
                <Typography variant="h5">Food Waste Logs</Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Link to="/sustainability-goals"><Button variant="outlined">Sustainability Goals</Button></Link>
                    
                    <Link to="/food-waste-logs"><Button variant="outlined">Food Waste Log</Button></Link>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}><Search /></IconButton>
                <IconButton color="primary" onClick={onClickClear}><Clear /></IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {user && <Link to="/add-food-waste-entry"><Button variant='contained' startIcon={<Add />}>Add Entry</Button></Link>}
            </Box>

            <Grid container spacing={2}>
                {wasteList.map((entry) => (
                    <Grid item xs={12} md={6} lg={4} key={entry.foodWasteEntryId}>
                        <Card sx={{ border: '2px solid black', p: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6">Waste Reason: {entry.wasteReason}</Typography>
                                    {user && (
                                        <Link to={`/edit-food-waste-entry/${entry.wasteId}`}>
                                            <IconButton color="primary"><Edit /></IconButton>
                                        </Link>
                                    )}
                                </Box>

                                <Typography variant="body2" color="text.secondary">
                                    Logged On: {dayjs(entry.loggedOn).format(global.datetimeFormat)}
                                </Typography>

                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    Waste Amount: {entry.wasteAmount} kg
                                </Typography>

                                
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}