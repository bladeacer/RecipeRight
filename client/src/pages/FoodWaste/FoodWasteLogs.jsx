import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid2 as Grid, } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import UserContext from '../../contexts/UserContext';
import global from '../../global';

export default function FoodWasteLogs() {
    const [wasteList, setWasteList] = useState([]);
    const [search, setSearch] = useState("");
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const onSearchChange = (e) => setSearch(e.target.value);

    const getWasteEntries = () => {
        http.get("/foodWasteEntry").then((res) => {
            console.log(res.data);  // Add this line
            setWasteList(res.data);
        });
    };

    const searchWasteEntries = () => {
        http.get(`/foodWasteEntry?search=${search}`).then((res) => setWasteList(res.data));
    };

    useEffect(() => {
        getWasteEntries();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") searchWasteEntries();
    };

    const onClickSearch = () => searchWasteEntries();
    const onClickClear = () => {
        setSearch('');
        getWasteEntries();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pt: 1 }}>
                <h5>Food Waste Logs</h5>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <button className="pico-background-azure-500" onClick={() => { navigate("/sustainability-goals") }}>
                        Sustainability Goals</button>
                    <button className="pico-background-cyan-500" onClick={() => { navigate("/food-waste-logs") }}>Food Waste Log</button>
                </Box>
            </Box>

            <section>
                <div role="search">
                    <input value={search}
                        placeholder="Search"
                        onChange={onSearchChange}
                        onKeyDown={onSearchKeyDown}
                        style={{ scale: '104.5%', marginTop: '2.5px', marginLeft: '12px', marginRight: '14px' }}>
                    </input>
                    <button onClick={onClickSearch} >
                        <Search />
                    </button>
                    <button onClick={onClickClear} >
                        <Clear />
                    </button>
                    {user && <a href="/add-food-waste-entry"><button>Add Entry</button></a>}
                </div>
            </section>

            <Grid container spacing={2}>
                {wasteList.map((entry) => (
                    <Grid item xs={12} md={6} lg={4} key={entry.foodWasteEntryId}>

                        <article style={{ padding: '1rem' }}>
                            <header>
                                <nav>
                                    <ul>
                                        <li>
                                            <strong> Waste Reason: {entry.wasteReason} </strong>
                                            <p>
                                                <AccessTime sx={{ scale: "72.5%" }} />
                                                <small>
                                                    Logged On: {dayjs(entry.loggedOn).format(global.datetimeFormat)}
                                                </small>
                                            </p>
                                        </li>
                                    </ul>
                                    {user && (
                                        <ul>
                                            <li style={{ marginTop: '-2rem' }}>
                                                <button className="secondary" data-tooltip="Edit" onClick={() => navigate(`/edit-food-waste-entry/${entry.wasteId}`)}>
                                                    <Edit />
                                                </button>
                                            </li>
                                        </ul>
                                    )}

                                </nav>
                            </header>
                            <section>
                                Waste Amount: {entry.wasteAmount} kg
                            </section>
                        </article>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}