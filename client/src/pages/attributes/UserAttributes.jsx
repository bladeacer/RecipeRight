import { useEffect, useState } from 'react';
import { Box, Grid2 as Grid } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import global from '../../global';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function UserAttributes() {
    const navigate = useNavigate();
    const [userAttrs, setUserAttrs] = useState([]);
    const [search, setSearch] = useState("");

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const getUserAttrs = () => {
        http.get("/userattributes").then((res) => {
            setUserAttrs(res.data);
        }).catch(function (err) {
            toast.error(`${err.response.data.message}`);
        });
    };
    const searchUserAttrs = () => {
        http.get(`/userattributes?search=${search}`).then((res) => {
            setUserAttrs(res.data);
        }).catch(function (err) {
            toast.error(`${err.response.data.message}`);
        });
    }

    useEffect(() => {
        getUserAttrs();
    }, [])

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchUserAttrs();
        }
    };

    const onClickSearch = () => {
        searchUserAttrs();
    };

    const onClickClear = () => {
        setSearch('');
        getUserAttrs();
    };

    return (
        <Box>
            <h5>User Attributes</h5>

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
                    <button onClick={() => navigate('/adduserattribute')} >
                        Add
                    </button>
                </div>
            </section>

            <Grid container spacing={2}>
                {userAttrs.map((attr) => {
                    return (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={attr.userAttributesId}>
                            <article style={{ padding: '1rem' }}>
                                <header>
                                    <nav>
                                        <ul>
                                            <li>
                                                <strong> {attr.userAttributeName} </strong>
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
                                                <button className="secondary" data-tooltip="Edit" onClick={() => navigate(`/edituserattribute/${attr.userAttributesId}`)}>
                                                    <Edit />
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </header>
                                <section>
                                    {attr.userAttributeDescription}
                                </section>
                            </article>
                        </Grid>
                    );
                })}
            </Grid>
            <ToastContainer />
        </Box>
    )
}