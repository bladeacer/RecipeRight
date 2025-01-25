import { useEffect, useState } from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import { useNavigate } from 'react-router-dom';

export default function ResourceTypes() {
    const navigate = useNavigate();
    const [rtList, setRtlist] = useState([]);
    const [search, setSearch] = useState("");

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getRTs = () => {
        http.get("/resourcetype").then((res) => {
            setRtlist(res.data);
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
            <h5>Resource Types</h5>
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
                    <button onClick={() => navigate('/addresourcetype')} >
                        Add
                    </button>
                </div>
            </section>

            <Grid container spacing={2}>
                {
                    rtList.map((rt) => {
                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={rt.resourceTypeId}>
                                <article style={{ padding: '1rem' }}>
                                    <header>
                                        <nav>
                                            <ul>
                                                <li>
                                                    <strong> {rt.typeName} </strong>
                                                    <AccessTime sx={{ scale: "72.5%" }} />
                                                    <small>
                                                        {dayjs(rt.createdAt).format(global.datetimeFormat)}
                                                    </small>
                                                </li>
                                            </ul>
                                            <ul>
                                                <li style={{ marginTop: '-2rem' }}>
                                                    <button className="secondary" data-tooltip="Edit" onClick={() => navigate(`/editresourcetype/${rt.resourceTypeId}`)}>
                                                        <Edit />
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </header>
                                    <section>
                                        {rt.resourceTypeDescription}
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