import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid2 as Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import { useNavigate } from 'react-router-dom';

export default function Resources() {
    const navigate = useNavigate();
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
            <h5>Resources</h5>
            {/* <Typography variant="h5" sx={{ my: 2 }}>
                Resources 
            </Typography> */}

            <section>
                <div role="search">
                    <input value={search}
                        placeholder="Search"
                        onChange={onSearchChange}
                        onKeyDown={onSearchKeyDown}
                        style={{ scale: '104.5%', marginTop: '2.5px', marginLeft: '12px', marginRight: '14px' }}>
                    </input>
                    <button onClick={onClickSearch}
                    >
                        <Search />
                    </button>
                    <button onClick={onClickClear} >
                        <Clear />
                    </button>
                    <button onClick={() => navigate('/addresource')} >
                        Add
                    </button>
                </div>
            </section>

            <Grid container spacing={2}>
                {
                    resList.map((res, i) => {
                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={res.resourceId}>
                                <article style={{ padding: '1rem' }}>
                                    <header>
                                        <nav>
                                            <ul>
                                                <li>
                                                    Name: <strong> {res.resourceName} </strong>
                                                    <AccessTime sx={{ scale: "72.5%" }} />
                                                    <small>
                                                        {dayjs(res.createdAt).format(global.datetimeFormat)}
                                                    </small>
                                                </li>
                                            </ul>
                                            <ul>
                                                <li style={{ marginTop: '-2rem' }}>
                                                    <button className="secondary" data-tooltip="Edit" onClick={() => navigate(`/editresource/${res.resourceId}`)}>
                                                        <Edit />
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </header>
                                    <section>

                                    {res.resourceDescription}
                                    </section>
                                </article>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}