import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid2 as Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

export default function SustainabilityGoals() {
    const [goalList, setGoalList] = useState([]);
    const [search, setSearch] = useState("");
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getGoals = () => {
        http.get("/sustainabilityGoal").then((res) => {
            setGoalList(res.data);
            console.log(res.data);
        });
    };

    const searchGoals = () => {
        http.get(`/sustainabilityGoal?search=${search}`).then((res) => {
            setGoalList(res.data);
        });
    };

    useEffect(() => {
        getGoals();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchGoals();
        }
    };

    const onClickSearch = () => {
        searchGoals();
    };

    const onClickClear = () => {
        setSearch('');
        getGoals();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Sustainability Goals
            </Typography>

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
                {
                    user && (
                        <Link to="/add-sustainability-goal">
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    goalList.map((goal, i) => {
                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={goal.sustainabilityGoalId}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {goal.goalName}
                                            </Typography>
                                            {
                                                user && (
                                                    <Link to={`/edit-sustainability-goal/${goal.sustainabilityGoalId}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                )
                                            }
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(goal.createdOn).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {goal.goalDescription}
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
