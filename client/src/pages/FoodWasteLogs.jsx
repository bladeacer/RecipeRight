import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid2 as Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccessTime, Search, Clear } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

export default function FoodWasteLogs() {
    const [wasteList, setWasteList] = useState([]);
    const [search, setSearch] = useState("");
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getWasteLogs = () => {
        http.get("/foodWasteEntry").then((res) => {
            setWasteList(res.data);
            console.log(res.data);
        });
    };

    const searchWasteLogs = () => {
        http.get(`/foodWasteEntry?search=${search}`).then((res) => {
            setWasteList(res.data);
        });
    };

    useEffect(() => {
        getWasteLogs();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchWasteLogs();
        }
    };

    const onClickSearch = () => {
        searchWasteLogs();
    };

    const onClickClear = () => {
        setSearch('');
        getWasteLogs();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pt: 1 }}>
                <Typography variant="h5">
                    Food Waste Logs
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, paddingTop: '4px' }}>
                    <Link to="/sustainability-goals">
                        <Button variant="contained" sx={{ backgroundColor: "white", color: "black", border: "1px solid black" }}>
                            Sustainability Goals
                        </Button>
                    </Link>
                    <Link to="/sustainability-badges">
                        <Button variant="contained" sx={{ backgroundColor: "white", color: "black", border: "1px solid black" }}>
                            Sustainability Badges
                        </Button>
                    </Link>
                    <Link to="/food-waste-logs">
                        <Button variant="contained" sx={{ backgroundColor: "white", color: "black", border: "1px solid black" }}>
                            Food Waste Log
                        </Button>
                    </Link>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
            </Box>

            <Grid container spacing={2}>
                {
                    wasteList.map((waste, i) => {
                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={waste.wasteId}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {waste.wasteReason}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(waste.loggedOn).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Waste Amount: {waste.wasteAmount}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}
