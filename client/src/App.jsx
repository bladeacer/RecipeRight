import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
// import Tutorials from './pages/Tutorials';
// import AddTutorial from './pages/AddTutorial';
// import EditTutorial from './pages/EditTutorial';
// import MyForm from './reference/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import http from './http';
import UserContext from './contexts/UserContext';
import ResourceTypes from './pages/ResourceTypes';
import AddResourceType from './crud/AddResourceType';
import EditResourceType from './crud/EditResourceType';
import Home from './pages/Home';
import AddResource from './crud/AddResource';
import Resources from './pages/Resources';
import EditResource from './crud/EditResource';
import EditSustainabilityGoal from './crud/EditSustainabilityGoal';
import AddSustainabilityGoal from './crud/AddSustainabilityGoal';
import SustainabilityGoals from './pages/SustainabilityGoals';
import SustainabilityBadges from './pages/SustainabilityBadges';
import FoodWasteLogs from './pages/FoodWasteLogs';

import EditSustainabilityBadge from './crud/EditSustainabilityBadge';
import AddSustainabilityBadge from './crud/AddSustainabilityBadge';





function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    RecipeRight
                  </Typography>
                </Link>
                {user && (
                  <>
                    <Link to="/resourcetypes"><Typography>Resource Types</Typography></Link>
                    <Link to="/resources"><Typography>Resources</Typography></Link>
                    <Link to="/policide"><Typography>Policies</Typography></Link>
                    <Link to="/attributes"><Typography>Attributes</Typography></Link>
                    <Link to="/userattributes"><Typography>User Attributes</Typography></Link>
                    <Link to="/sustainability-goals"><Typography>Sustainability</Typography></Link>
                  </>
                )}
                {/* <Link to="/tutorials" ><Typography>Tutorials</Typography></Link> */}
                {/* <Link to="/form" ><Typography>Form</Typography></Link> */}
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )
                }
                {!user && (
                  <>
                    <Link to="/register" ><Typography>Register</Typography></Link>
                    <Link to="/login" ><Typography>Login</Typography></Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              {/* <Route path={"/"} element={<Tutorials />} />
              <Route path={"/tutorials"} element={<Tutorials />} />
              <Route path={"/addtutorial"} element={<AddTutorial />} />
              <Route path={"/edittutorial/:id"} element={<EditTutorial />} /> */}

              <Route path={"resourcetypes"} element={<ResourceTypes />} />
              <Route path={"addresourcetype"} element={<AddResourceType />} />
              <Route path={"/editresourcetype/:id"} element={<EditResourceType />} />
              <Route path={"/add-sustainability-goal"} element={<AddSustainabilityGoal />} /> 
              <Route path={"/edit-sustainability-goal/:id"} element={<EditSustainabilityGoal />} />
              <Route path="/sustainability-goals" element={<SustainabilityGoals />} />
              <Route path="/sustainability-badges" element={<SustainabilityBadges />} />
<Route path="/add-sustainability-badge" element={<AddSustainabilityBadge />} />
<Route path="/edit-sustainability-badge/:id" element={<EditSustainabilityBadge />} />
<Route path="/food-waste-logs" element={<FoodWasteLogs />} />
              



              <Route path={"/resources"} element={<Resources />} />
              <Route path={"/addresource"} element={<AddResource />} />
              <Route path={"/editresource/:id"} element={<EditResource/>} />

              <Route path={"/"} element={<Home />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              {/* <Route path={"/form"} element={<MyForm />} /> */}
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
