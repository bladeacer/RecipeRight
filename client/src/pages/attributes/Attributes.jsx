import { useEffect, useState } from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import global from '../../global';
import { useNavigate } from 'react-router-dom';
export default function Attributes() {

    const navigate = useNavigate();
    const [attributes, setAttributes] = useState([]);
    const [search, setSearch] = useState("");

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const getAttributes = () => {
        http.get("/attributes").then((res) => {
            setAttributes(res.data);
        });
    };
    const searchAttributes = () => {
        http.get(`/attributes?search=${search}`).then((res) => {
            setAttributes(res.data);
        })
    };
    useEffect(() => {
        getAttributes();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchAttributes();
        }
    };

    const onClickSearch = () => {
        searchAttributes();
    };

    const onClickClear = () => {
        setSearch('');
        getAttributes();
    };

    return (
        <Box>
            <h5>Attributes</h5>
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
                    <button onClick={() => navigate('/addattribute')} >
                        Add
                    </button>
                </div>
            </section>

            <Grid container spacing={2}>
                {attributes.map((attr) => {
                    return (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={attr.attributesId}>
                            <article style={{ padding: '1rem' }}>
                                <header>
                                    <nav>
                                        <ul>
                                            <li>
                                                <strong> {attr.attributeName} </strong>
                                                <p>
                                                    <AccessTime sx={{ scale: "72.5%" }} />
                                                    <small>
                                                        {dayjs(attr.createdAt).format(global.datetimeFormat)}
                                                    </small>
                                                </p>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li style={{ marginTop: '-2rem' }}>
                                                <button className="secondary" data-tooltip="Edit" onClick={() => navigate(`/editattribute/${attr.attributesId}`)}>
                                                    <Edit />
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </header>
                                <section>
                                    {attr.attributeDescription}
                                </section>
                            </article>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}