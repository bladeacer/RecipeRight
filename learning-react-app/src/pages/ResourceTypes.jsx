import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid2 as Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

export default function ResourceTypes() {
    const [rtList, setRtlist] = useState([]);
    const [search, setSearch] = useState("");
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };


    const getRTs = () => {
        http.get("/resourcetype").then((res) => {
            setRtlist(res.data);
            // console.log(res.data);
        });
    };

    const searchRTs = () => {
        http.get(`/resourcetype?search=${search}`).then((res) => {
            setRtlist(res.data);
        })
    };
    useEffect(() => {
        getRTs();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchRTs();
        }
    };

    const onClickSearch = () => {
        searchRTs();
    };

    const onClickClear = () => {
        setSearch('');
        getRTs();
    };


    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Resource Types
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
                        <Link to="/addresourcetype">
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    rtList.map((rt, i) => {
                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={rt.resourceTypeId}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {rt.typeName}
                                            </Typography>
                                            {
                                                user && (
                                                    <Link to={`/editresourcetype/${rt.resourceTypeId}`}>
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
                                                {dayjs(rt.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {rt.resourceTypeDescription}
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