import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid2 as Grid } from '@mui/material';
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

    const getGoals = () => {
        http.get("/sustainabilityGoal").then((res) => {
            console.log(res.data);
            setGoalList(res.data);
        });
    };

    const searchGoals = () => {
        http.get(`/sustainabilityGoal?search=${search}`).then((res) => setGoalList(res.data));
    };

    useEffect(() => {
        getGoals();
    }, []);

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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pt: 1 }}>
                <h5>Sustainability Goals</h5>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <button className="pico-background-azure-500" onClick={() => {navigate("/sustainability-goals")}}>
                        Sustainability Goals</button>
                    <button className="pico-background-cyan-500" onClick={() => {navigate("/food-waste-logs")}}>Food Waste Log</button>
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
                    {user && <button className='outline'><a href="/add-sustinability-goal">Add</a></button>}
                </div>
            </section>

            <Grid container spacing={2}>
                {goalList.map((goal) => {
                    const progress = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;

                    return (
                        <Grid item xs={12} key={goal.sustainabilityGoalId}>
                            <article style={{ padding: '1rem' }}>
                                <header>
                                    <nav>
                                        <ul>
                                            <li>
                                                <strong> {goal.goalName} </strong>
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
                                    <progress value={`${progress}`} max="100" />
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
