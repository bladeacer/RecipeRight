import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Box,
  Divider,
  Typography,
  Grid,
  Card,
  CardContent,
  Input,
  IconButton,
  Button,
  Container,
  Avatar,
  Stack,
  Skeleton,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import http from "../../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rewardcard from "../../components/RewardCard";
import { palette, width } from "@mui/system";
import theme from "../../themes/MyTheme";

function Rewards() {
  const navigate = useNavigate();
  const [rewardList, setRewardList] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [search, setSearch] = useState("");
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userPoints, setuserPoints] = useState(0);

  const aspectRatio = 16 / 9;
  
  const handleOpen = (reward) => {
    setOpen(true);
    setSelectedReward(reward);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReward(null);
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const redeemReward = () => {

    const { id } = selectedReward;

    http
      .post(`/redeem/${id}`)
      .then((res) => {
        toast.success("Redeemed Successfully");
        setTimeout(() => {
          getRewards();
          window.location.reload();
        }, 2000);
      }).catch((error) => {
        toast.error("Insufficient Points");
      });
    handleClose();
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
    if (!user) {
      return;
    }
    const fetchUserPoints = async () => {
      try {
        const response = await http.get("/user/point");
        setuserPoints(response.data.points);
      } catch (error) {
        console.error("Error fetching user points:", error);
      }
    };
    fetchUserPoints();
    getRewards();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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


  // }

  // Conditional return
  if (!user) {
    return (
      <Container
        sx={{
          maxWidth: "100%",
          mt: "10px",
          width: "100vw",
          height: " 700px",
          backgroundImage: `url('/static/images/reward.jpg')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button variant="contained" sx={{ textDecoration: "none" }}>
          <Link to={"/login"} sx={{ textDecoration: "none" }}>
            Start Earning Points
          </Link>
        </Button>
      </Container>
    );
  }

  return (

    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <Card
          className="reward-container"
          sx={{
            height: "100px",
            width: "100px",
            boxShadow: 3,
            borderRadius: 2,
            p: 2,
            m: 1,
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: 6,
            },
            minHeight: "250px",
            minWidth: "500px",
            margin: "auto",
            textAlign: "center",
          }}
        >
          <CardContent>
            <Typography variant="h5">Rewards</Typography>
            <Avatar
              sx={{
                width: "70px",
                height: "70px",
                margin: "auto",
                mt: "15px",
                mb: "20px",
              }}
            ></Avatar>
            <Typography variant="h6" sx={{}}>
              Points: {userPoints}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Divider
        sx={{
          width: "100%",
          height: "10px",
          backgroundColor: "#000",
          opacity: "0.7",
          mb: "50px",
        }}
      ></Divider>

      <Container sx={{ disaply: "flex" }}>
        <Typography
          variant="h4"
          sx={{ mb: 5, textAlign: "center", fontFamily: "sans-serif" }}
        >
          Reward Catalog
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
        </Box>

        <Grid container spacing={5} className="Reward-catalog" sx={{ mt: 5 }}>
          {rewardList.map((reward) => (
            <Grid item xs={12} md={6} lg={4} key={reward.id}>
              {loading ? (
                <Stack spacing={1}>
                  <Box
                    sx={{
                      width: "100%",
                      background: "#f0f0f0", // Background color for skeleton
                      borderRadius: "8px",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={"100%"}
                      sx={{ height: "320px" }}
                    />
                  </Box>
                  <Skeleton variant="text" width={"80%"} />
                  <Skeleton variant="text" width={"60%"} />
                  <Skeleton variant="text" width={"40%"} height={50} />
                </Stack>
              ) : (
                <Card
                  className="reward-container"
                  color={"accent"}
                  sx={{
                    backgroundColor: (theme) => theme.palette.background.paper,
                    border: (theme) =>
                      `1px solid ${theme.palette.primary.main}`,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                  }}
                >
                  {reward.imageFile && (
                    <Box className="aspect-ratio-container" sx={{}}>
                      <img
                        alt="reward"
                        src={`${import.meta.env.VITE_FILE_BASE_URL}${
                          reward.imageFile
                        }`}
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}
                  <Divider color={"#f5a623"} sx={{ mt: 2, pb: "1px" }} />

                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="h6">{reward.rewardname}</Typography>
                      <Typography variant="body1">
                        Points: {reward.point}
                      </Typography>
                      <Button
                        variant={"outlined"}
                        color={"accent"}
                        sx={{
                          borderRadius: "8px",
                          mt: 2,
                        }}
                        onClick={() => handleOpen(reward)}
                      >
                        redeem
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Redeem Reward</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to redeem this reward?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={redeemReward}
                  >
                    Redeem
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Box height={400}></Box>
      <ToastContainer/>
    </Box>

  );
}
export default Rewards;
