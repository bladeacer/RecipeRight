import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import UserContext from '../../contexts/UserContext';
import global from '../../global';
import ChatButton from '../../components/ChatButton';

export default function FoodWasteLogs() {
    const [wasteList, setWasteList] = useState([]);  
    const [filteredWasteList, setFilteredWasteList] = useState([]); 
    const [search, setSearch] = useState("");
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // Fetch all food waste entries for the logged-in user
    const getWasteEntries = () => {
        http.get("/foodWasteEntry").then((res) => {
            const userWasteEntries = res.data.filter(entry => entry.userId === user?.id);
            setWasteList(userWasteEntries);
            setFilteredWasteList(userWasteEntries); // Default to full list
        });
    };

    // Filter entries based on search input
    const filterWasteEntries = (query) => {
        if (!query) {
            setFilteredWasteList(wasteList); // Reset to full list when query is empty
        } else {
            const lowerQuery = query.toLowerCase();
            setFilteredWasteList(
                wasteList.filter(entry =>
                    entry.wasteReason.toLowerCase().includes(lowerQuery) || 
                    entry.wasteAmount.toString().includes(lowerQuery) ||
                    dayjs(entry.loggedOn).format("YYYY-MM-DD").includes(lowerQuery) // Search by date
                )
            );
        }
    };

    // Handle search input change
    const onSearchChange = (e) => {
        setSearch(e.target.value);
        filterWasteEntries(e.target.value);
    };

    // Trigger search on "Enter" key press
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            filterWasteEntries(search);
        }
    };

    // Clear search input
    const onClickClear = () => {
        setSearch('');
        setFilteredWasteList(wasteList);
    };

    const onClickSearch = () => {
        filterWasteEntries(search);
    };

    useEffect(() => {
        if (user) getWasteEntries();
    }, [user]);

    return (
        <Box>
            {/* 🆕 Updated Top Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pt: 1 }}>
                <h5>Food Waste Logs</h5>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <button className="pico-background-azure-500" onClick={() => {navigate("/sustainability-goals")}}>
                        Sustainability Goals
                    </button>
                    <button className="pico-background-cyan-500" onClick={() => {navigate("/food-waste-logs")}}>
                        Food Waste Log
                    </button>
                </Box>
            </Box>

            {/* 🆕 Updated Search Section */}
            <section>
                <div role='search'>
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
                    {user && <button className='outline'><a href="/add-food-waste-entry">Add</a></button>}
                </div>
            </section>

            {/* Food Waste Entries */}
            <Grid container spacing={2}>
                {filteredWasteList.length > 0 ? (
                    filteredWasteList.map((entry) => (
                        <Grid item xs={12} md={6} lg={4} key={entry.wasteId}>
                            <article style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
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
                    ))
                ) : (
                    <p>No food waste entries found.</p>
                )}
            </Grid>

            <ChatButton />
        </Box>
    );
}
