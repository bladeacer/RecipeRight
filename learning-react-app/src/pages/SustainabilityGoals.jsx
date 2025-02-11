import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, LinearProgress } from '@mui/material';
import { AccessTime, Search, Clear, Edit, Add } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

export default function SustainabilityGoals() {
    const [goalList, setGoalList] = useState([]);
    const [search, setSearch] = useState("");
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => setSearch(e.target.value);

    const getGoals = () => {
        http.get("/sustainabilityGoal").then((res) => {
            console.log(res.data);  // Add this line
            setGoalList(res.data);
        });
    };
    

    const searchGoals = () => {
        http.get(`/sustainabilityGoal?search=${search}`).then((res) => setGoalList(res.data));
    };

    useEffect(() => {
        getGoals();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") searchGoals();
    };

    const onClickSearch = () => searchGoals();
    const onClickClear = () => {
        setSearch('');
        getGoals();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pt: 1 }}>
                <Typography variant="h5">Sustainability Goals</Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Link to="/sustainability-goals"><Button variant="outlined">Sustainability Goals</Button></Link>
                    <Link to="/sustainability-badges"><Button variant="outlined">Sustainability Badges</Button></Link>
                    <Link to="/food-waste-logs"><Button variant="outlined">Food Waste Log</Button></Link>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}><Search /></IconButton>
                <IconButton color="primary" onClick={onClickClear}><Clear /></IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {user && <Link to="/add-sustainability-goal"><Button variant='contained' startIcon={<Add />}>Add</Button></Link>}
            </Box>

            <Grid container spacing={2}>
                {goalList.map((goal) => {
                    const progress = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;


                    return (
                        <Grid item xs={12} md={6} lg={4} key={goal.sustainabilityGoalId}>
                            <Card sx={{ border: '2px solid black', p: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6">{goal.goalName}</Typography>
                                        {user && (
                                            <Link to={`/edit-sustainability-goal/${goal.sustainabilityGoalId}`}>
                                                <IconButton color="primary"><Edit /></IconButton>
                                            </Link>
                                        )}
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">
                                        Deadline: {dayjs(goal.createdOn).format(global.datetimeFormat)}
                                    </Typography>

                                    <LinearProgress variant="determinate" value={progress} sx={{ mt: 2, height: 10, backgroundColor: '#ddd' }} />
                                    <Typography variant="h6" color="green" sx={{ textAlign: 'right', mt: 1 }}>
                                        {progress.toFixed(0)}%
                                    </Typography>

                                    <Typography sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>{goal.goalDescription}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
