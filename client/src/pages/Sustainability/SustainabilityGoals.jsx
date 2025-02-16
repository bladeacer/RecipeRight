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
    const [activeGoals, setActiveGoals] = useState([]);
    const [completedGoals, setCompletedGoals] = useState([]);
    const [search, setSearch] = useState("");
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const onSearchChange = (e) => setSearch(e.target.value);

    const getGoals = () => {
        http.get("/sustainabilityGoal").then((res) => {
            console.log(res.data);
            const userGoals = res.data.filter(goal => goal.userId === user?.id);

            // Separate active and completed goals
            setActiveGoals(userGoals.filter(goal => goal.currentValue <= goal.targetValue));
            setCompletedGoals(userGoals.filter(goal => goal.currentValue > goal.targetValue));
        });
    };

    const searchGoals = () => {
        http.get(`/sustainabilityGoal?search=${search}`).then((res) => {
            const userGoals = res.data.filter(goal => goal.userId === user?.id);

            setActiveGoals(userGoals.filter(goal => goal.currentValue <= goal.targetValue));
            setCompletedGoals(userGoals.filter(goal => goal.currentValue > goal.targetValue));
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

            {/* Active Goals */}
            <Grid container spacing={2}>
                {activeGoals.length > 0 ? (
                    activeGoals.map((goal) => {
                        const progress = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
                        return (
                            <Grid item xs={12} key={goal.sustainabilityGoalId}>
                                <article style={{
                                    padding: '1.5rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#f0f0f0', // Light gray for active goals
                                    border: '1px solid #d6d6d6',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
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
                    })
                ) : (
                    <p>No active sustainability goals available.</p>
                )}
            </Grid>

            {/* Completed Goals Section */}
            {completedGoals.length > 0 && (
                <>
                    <h5 style={{ marginTop: '2rem' }}>Completed Goals</h5>
                    <Grid container spacing={2}>
                        {completedGoals.map((goal) => {
                            const progress = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
                            return (
                                <Grid item xs={12} key={goal.sustainabilityGoalId}>
                                    <article style={{
    padding: '1.5rem',
    borderRadius: '8px',
    backgroundColor: '#fff4c2', // Light gold outer box
    border: '2px solid #E1B530', // Slightly darker gold for definition
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)' // Softer shadow for depth
}}>
    <header style={{
        backgroundColor: '#FAF3D1', // Even lighter gold for contrast
        padding: '1rem',
        borderRadius: '6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
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
        </nav>
        {user && (
            <button className="secondary" data-tooltip="Edit" onClick={() => navigate(`/edit-sustainability-goal/${goal.sustainabilityGoalId}`)}>
                <Edit />
            </button>
        )}
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
                </>
            )}

            <ChatButton />
        </Box>
    );
}
