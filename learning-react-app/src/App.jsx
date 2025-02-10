import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile'; // Import Profile component
import http from './http';
import UserContext from './contexts/UserContext';
import EditProfile from './pages/EditProfile'; // Import EditProfile component
import Security from './pages/Security'; // Import Security component
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard component
import ProtectedRoute from './pages/ProtectedRoute'; // Import ProtectedRoute component
import Pantry from './pages/Pantry';
import RecipeDetails from "./pages/RecipeDetails";
import Bookmarks from "./pages/Bookmarks";
import Fridge from "./pages/Fridge";
import EditSustainabilityGoal from './pages/EditSustainabilityGoal';
import AddSustainabilityGoal from './pages/AddSustainabilityGoal';
import SustainabilityGoals from './pages/SustainabilityGoals';
import SustainabilityBadges from './pages/SustainabilityBadges';
import FoodWasteLogs from './pages/FoodWasteLogs';
import EditSustainabilityBadge from './pages/EditSustainabilityBadge';
import AddSustainabilityBadge from './pages/AddSustainabilityBadge';
import ForgotPassword from "./pages/ForgotPassword"; 
import ResetPassword from "./pages/ResetPassword"; 
import Chatbot from './pages/Chatbot';
import TwoFactorAuth from './pages/TwoFactorAuth';




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
        <AppBar position="static" className="AppBar" sx={{ backgroundColor: '#1a1a1a', padding: '0 1rem' }}>
  <Container>
    <Toolbar disableGutters={true} sx={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* Left side - Brand and Links */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Typography variant="h6" component="div" sx={{ color: '#fff', fontWeight: 'bold', '&:hover': { color: '#f5ba13' } }}>
            RecipeRight
          </Typography>
        </Link>
        {user && (
          <>
            <Link to="/pantry" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: '#fff', textTransform: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                Pantry
              </Typography>
            </Link>
            <Link to="/bookmarks" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: '#fff', textTransform: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                Bookmarks
              </Typography>
            </Link>
            <Link to="/sustainability-goals" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: '#fff', textTransform: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                Sustainability
              </Typography>
            </Link>
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {user && (
          <>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: '#fff', textTransform: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                {user.name}
              </Typography>
            </Link>
            <Button
              onClick={logout}
              sx={{
                color: '#fff',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#f5ba13',
                  color: '#1a1a1a',
                },
              }}
            >
              Logout
            </Button>
          </>
        )}
        {!user && (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: '#fff', textTransform: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
              Login
            </Typography>
          </Link>
        )}
      </Box>
    </Toolbar>
  </Container>
</AppBar>


          <Container>
            <Routes>
              <Route path={"/"} element={<Tutorials />} />
              <Route path={"/tutorials"} element={<Tutorials />} />
              <Route path={"/addtutorial"} element={<AddTutorial />} />
              <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/form"} element={<MyForm />} />
              <Route path={"/profile"} element={<Profile />} />
              <Route path={"/edit-profile"} element={<EditProfile />} />
              <Route path={"/security"} element={<Security />} />
              <Route path={"/admin/dashboard"} element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path={"/pantry"} element={<Pantry />} />
              <Route path={"/recipe/:id"} element={<RecipeDetails />} />
              <Route path={"/bookmarks"} element={<Bookmarks />} />
              <Route path={"/fridge"} element={<Fridge />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              <Route path="/verify-2fa" element={<TwoFactorAuth />} />
              <Route path={"/add-sustainability-goal"} element={<AddSustainabilityGoal />} /> 
              <Route path={"/edit-sustainability-goal/:id"} element={<EditSustainabilityGoal />} />
              <Route path="/sustainability-goals" element={<SustainabilityGoals />} />
              <Route path="/sustainability-badges" element={<SustainabilityBadges />} />
              <Route path="/add-sustainability-badge" element={<AddSustainabilityBadge />} />
              <Route path="/edit-sustainability-badge/:id" element={<EditSustainabilityBadge />} />
              <Route path="/food-waste-logs" element={<FoodWasteLogs />} />
              <Route path="/chatbot" element={<Chatbot />} />
              
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
