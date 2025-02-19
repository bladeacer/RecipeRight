import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Input,
  IconButton,
  Button,
  Container,
} from "@mui/material";
import {
  AccountCircle,
  AccessTime,
  Search,
  Clear,
  Edit,
  Directions,
} from "@mui/icons-material";
import http from "../../http";
import dayjs from "dayjs";
import global from "../../global";
import { ToastContainer, toast } from "react-toastify";

function StaffReward() {
  const [rewardList, setRewardList] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useContext(UserContext);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getRewards = () => {
    http.get("/reward").then((res) => {
      setRewardList(res.data);
    });
  };

  const searchRewards = () => {
    http.get(`/reward?search=${search}`).then((res) => {
      setRewardList(res.data);
    });
  };

  useEffect(() => {
    getRewards();
  }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchRewards();
    }
  };

  const onClickSearch = () => {
    searchRewards();
  };

  const onClickClear = () => {
    setSearch("");
    getRewards();
  };

  // Conditional return
      if (!user) {
        return (
            <Container className="full-width-box"   sx= {{
                mt: "10px",
                width: "100vw",
                height:" 700px",
                backgroundImage: `url('/static/images/reward.jpg')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
            }}>
                <Button variant="contained" sx= {{ textDecoration: "none"}}>
                    <Link to={"/login"} sx= {{ textDecoration: "none"}}>Start Earning Points</Link>
                </Button>
            </Container>
            
        ); 
      }

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Rewards
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Input
          value={search}
          placeholder="Search"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Link to="/addreward" style={{ textDecoration: "none" }}>
          <Button variant="contained">Add</Button>
        </Link>
      </Box>

      <Grid container spacing={2}>
        {rewardList.map((reward) => (
          <Grid item xs={12} md={6} lg={4} key={reward.id}>
            <Card>
              {reward.imageFile && (
                <Box className="aspect-ratio-container">
                  <img
                    alt="tutorial"
                    src={`${import.meta.env.VITE_FILE_BASE_URL}${reward.imageFile}`}
                  />
                </Box>
              )}
              <CardContent>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {reward.rewardname}
                  </Typography>
                  {user.id === reward.userId && (
                    <Link to={`/editreward/${reward.id}`}>
                      <IconButton color="primary" sx={{ padding: "4px" }}>
                        <Edit />
                      </IconButton>
                    </Link>
                  )}
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  color="text.secondary"
                >
                  <AccountCircle sx={{ mr: 1 }} />
                  <Typography>{reward.user?.name}</Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  color="text.secondary"
                >
                  <AccessTime sx={{ mr: 1 }} />
                  <Typography>
                    {dayjs(reward.createdAt).format(global.datetimeFormat)}
                  </Typography>
                </Box>
                <Typography sx={{ whiteSpace: "pre-wrap" }}>
                  {reward.description}
                </Typography>
                <Typography sx={{ whiteSpace: "pre-wrap" }}>
                  {reward.point}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ToastContainer/>
    </Box>
  );
}

export default StaffReward;
