import { useEffect, useState } from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import global from '../../global';
import { useNavigate } from 'react-router-dom';
export default function Policies() {
    const navigate = useNavigate();
    const [policies, setPolicies] = useState([]);
    const [search, setSearch] = useState("");
    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const getPolicies = () => {
        http.get('policy').then((res) => {
            setPolicies(res.data)
        })
    };
    const searchPolicies = () => {
        http.get(`/policy?search=${search}`).then((res) => {
            setPolicies(res.data);
        })
    };

    useEffect(() => {
        getPolicies();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchPolicies();
        }
    };

    const onClickSearch = () => {
        searchPolicies();
    };

    const onClickClear = () => {
        setSearch('');
        getPolicies();
    };

    return (
        <Box>
            <h5>Policies</h5>
            <section>
                <div role='search'>
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
                    <button onClick={() => navigate('/addpolicy')} >
                        Add
                    </button>
                </div>
            </section>
            <Grid container spacing={2}>
                {
                    policies.map((res) => {
                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={res.policiesId}>
                            <article style={{ padding: '1rem' }}>
                                <header>
                                    <nav>
                                        <ul>
                                            <li>
                                                Name: <strong> {res.policiesName} </strong>
                                                <AccessTime sx={{ scale: "72.5%" }} />
                                                <small>
                                                    {dayjs(res.createdAt).format(global.datetimeFormat)}
                                                </small>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li style={{ marginTop: '-2rem' }}>
                                                <button className="secondary" data-tooltip="Edit" onClick={() => navigate(`/editpolicy/${res.policiesId}`)}>
                                                    <Edit />
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </header>
                                <section>
                                    {res.policiesDescription}
                                </section>
                            </article>
                        </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    )
}