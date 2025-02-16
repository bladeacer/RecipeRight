import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import UserContext from '../../contexts/UserContext';
import global from '../../global';
import ChatButton from '../../components/ChatButton';

export default function SustainabilityGoals() {
    const [goalList, setGoalList] = useState([]);
    const [search, setSearch] = useState("");
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const onSearchChange = (e) => setSearch(e.target.value);

    const getBadge = (progress) => {
        if (progress >= 100) {
            return { name: "🏆 Gold Badge", color: "#FFD700" }; // Gold for full completion
        } else if (progress >= 75) {
            return { name: "🥈 Silver Badge", color: "#C0C0C0" }; // Silver for 75%+
        } else if (progress >= 50) {
            return { name: "🥉 Bronze Badge", color: "#CD7F32" }; // Bronze for 50%+
        }
        return null; // No badge yet
    };

    const getGoals = () => {
        http.get("/sustainabilityGoal").then((res) => {
            console.log(res.data);
            setGoalList(res.data.filter(goal => goal.userId === user?.id)); // Show only logged-in user's goals
        });
    };

    const searchGoals = () => {
        http.get(`/sustainabilityGoal?search=${search}`).then((res) => {
            setGoalList(res.data.filter(goal => goal.userId === user?.id));
        });
    };

    useEffect(() => {
        getGoals();
    }, [user]);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") searchGoals();
    };

    const onClickSearch = () => searchGoals();
    const onClickClear = () => {
        setSearch('');
        getGoals();
    };

    return (
        <Box>
            
            {/* Top Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pt: 1 }}>
                <h5>Sustainability Goals</h5>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <button className="pico-background-azure-500" onClick={() => navigate("/sustainability-goals")}>
                        Sustainability Goals
                    </button>
                    <button className="pico-background-cyan-500" onClick={() => navigate("/food-waste-logs")}>
                        Food Waste Log
                    </button>
                </Box>
            </Box>

            {/* Search Section */}
            <section>
                <div role='search'>
                    <input value={search}
                        placeholder="Search"
                        onChange={onSearchChange}
                        onKeyDown={onSearchKeyDown}
                        style={{ scale: '104.5%', marginTop: '2.5px', marginLeft: '12px', marginRight: '14px' }}>
                    </input>
                    <button onClick={onClickSearch}>
                        <Search />
                    </button>
                    <button onClick={onClickClear}>
                        <Clear />
                    </button>
                    {user && <button className='outline'><a href="/add-sustainability-goal">Add</a></button>}
                </div>
            </section>

            {/* Grid - Ensure Each Goal Stretches Across Entire Row */}
            <Grid container spacing={2}>
                {goalList.map((goal) => {
                    const progress = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;

                    return (
                        <Grid item xs={12} key={goal.sustainabilityGoalId}>
                            <article style={{
                                padding: '1.5rem',
                                borderRadius: '8px',
                                backgroundColor: '#f0f0f0', // Light gray for contrast
                                border: '1px solid #d6d6d6', // Soft border for better definition
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' // Light shadow for depth
                            }}>
                                <header>
                                    <nav>
                                        <ul>
                                            <li>
                                                <strong>{goal.goalName}</strong>
                                                <p>
                                                    <AccessTime sx={{ scale: "72.5%" }} />
                                                    <small>
                                                        Deadline: {dayjs(goal.createdOn).format(global.datetimeFormat)}
                                                    </small>
                                                </p>
                                            </li>
                                        </ul>
                                        {user && (
                                            <ul>
                                                <li style={{ marginTop: '-2rem' }}>
                                                    <button className="secondary" data-tooltip="Edit" onClick={() => navigate(`/edit-sustainability-goal/${goal.sustainabilityGoalId}`)}>
                                                        <Edit />
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </nav>
                                </header>
                                <section>
                                    {goal.goalDescription}
                                    <progress value={`${progress}`} max="100" style={{ width: "100%" }} />
                                </section>
                            </article>
                        </Grid>
                    );
                })}
            </Grid>

            <ChatButton />
        </Box>
    );
}
