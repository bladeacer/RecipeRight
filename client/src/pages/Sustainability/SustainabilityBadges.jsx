import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid2 as Grid } from '@mui/material';
import { AccessTime, Search, Clear } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import global from '../../global';
import ChatButton from '../../components/ChatButton';
import UserContext from '../../contexts/UserContext';

export default function SustainabilityBadges() {
    const [badgeList, setBadgeList] = useState([]);
    const [search, setSearch] = useState("");
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getBadges = () => {
        http.get("/sustainabilityBadge").then((res) => {
            const filteredBadges = res.data.filter((badge) => badge.userId === user?.id);
            setBadgeList(filteredBadges);
            console.log(filteredBadges);
        });
    };

    const searchBadges = () => {
        http.get(`/sustainabilityBadge?search=${search}`).then((res) => {
            const filteredBadges = res.data.filter((badge) => badge.userId === user?.id);
            setBadgeList(filteredBadges);
        });
    };

    useEffect(() => {
        if (user) getBadges();
    }, [user]);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchBadges();
        }
    };

    const onClickSearch = () => {
        searchBadges();
    };

    const onClickClear = () => {
        setSearch('');
        getBadges();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pt: 1 }}>
                <h5>Sustainability Badges</h5>

                <Box sx={{ display: 'flex', gap: 2, paddingTop: '4px' }}>
                    <button className="pico-background-azure-500" onClick={() => { navigate("/sustainability-goals") }}>
                        Sustainability Goals</button>
                    <button className="pico-background-amber-500" onClick={() => { navigate("/sustainability-badges") }}>Sustainability Badges</button>
                    <button className="pico-background-cyan-500" onClick={() => { navigate("/food-waste-logs") }}>Food Waste Log</button>
                </Box>
            </Box>

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
                </div>
            </section>

            <Grid container spacing={2}>
                {badgeList.map((badge) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={badge.badgeId}>
                        <article style={{ padding: '1rem' }}>
                            <header>
                                <nav>
                                    <ul>
                                        <li>
                                            <strong> {badge.badgeName} </strong>
                                            <p>
                                                <AccessTime sx={{ scale: "72.5%" }} />
                                                <small>
                                                    Awarded On: {dayjs(badge.awardedOn).format(global.datetimeFormat)}
                                                </small>
                                            </p>
                                        </li>
                                    </ul>
                                </nav>
                            </header>
                            <section>
                                {badge.badgeDescription}
                            </section>
                        </article>
                    </Grid>
                ))}
            </Grid>
            <ChatButton />
        </Box>
    );
}
