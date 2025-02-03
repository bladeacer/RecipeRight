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
          <AppBar position="static" className="AppBar" sx={{ backgroundColor: '#0f0e0f' }}>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    RecipeRight
                  </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    <Link to="/pantry" ><Typography>Pantry</Typography></Link>
                    <Link to="/Bookmarks" ><Typography>Bookmarks</Typography></Link>
                    <Link to="/profile"><Typography>{user.name}</Typography></Link>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/login" ><Typography>Login</Typography></Link>
                  </>
                )}
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
              
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
