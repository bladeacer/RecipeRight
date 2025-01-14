import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid2 as Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

export default function Resources() {
    const [resList, setReslist] = useState([]);
    const [search, setSearch] = useState("");
    const { user } = useContext(UserContext);
    const [desList, setDesList] = useState('not selected');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getRes = () => {
        http.get("/resource").then((res) => {
            setReslist(res.data);
            console.log(res.data);
        });
    };
    // Get resource type id and render details on it.

    const searchRes = () => {
        http.get(`/resource?search=${search}`).then((res) => {
            setReslist(res.data);
        })
    };
    useEffect(() => {
        getRes();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchRes();
        }
    }

    const onClickSearch = () => {
        searchRes();
    };

    const onClickClear = () => {
        setSearch('');
        getRes();
    };


    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Resources 
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
                        <Link to="/addresource">
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    resList.map((res, i) => {
                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={res.resourceId}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {res.resourceName}
                                            </Typography>
                                            {
                                                user && (
                                                    <Link to={`/editresource/${res.resourceId}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                )
                                            }
                                        </Box>
                                        {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccountCircle sx={{ mr: 1 }} />
                                            <Typography>
                                                {rt.user?.name}
                                            </Typography>
                                        </Box> */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(res.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {res.resourceDescription}
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