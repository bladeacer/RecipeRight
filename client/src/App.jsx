import './App.css';
import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import http from './http';
import UserContext from './contexts/UserContext';

import Register from './pages/Accounts/Register';
import Login from './pages/Accounts/Login';
import Profile from './pages/Accounts/Profile'; // Import Profile component
import EditProfile from './pages/Accounts/EditProfile'; // Import EditProfile component
import Security from './pages/Accounts/Security'; // Import Security component
import ForgotPassword from "./pages/Accounts/ForgotPassword";
import ResetPassword from "./pages/Accounts/ResetPassword";
import TwoFactorAuth from './pages/Accounts/TwoFactorAuth';
import CompleteProfile from './pages/Accounts/CompleteProfile';

import Pantry from './pages/Recipe/Pantry';
import RecipeDetails from "./pages/Recipe/RecipeDetails";
import Bookmarks from "./pages/Recipe/Bookmarks";
import Fridge from "./pages/Recipe/Fridge";
import Chatbot from './pages/Recipe/Chatbot';

import EditSustainabilityGoal from './pages/Sustainability/EditSustainabilityGoal';
import AddSustainabilityGoal from './pages/Sustainability/AddSustainabilityGoal';
import SustainabilityGoals from './pages/Sustainability/SustainabilityGoals';
import SustainabilityBadges from './pages/Sustainability/SustainabilityBadges';
import EditSustainabilityBadge from './pages/Sustainability/EditSustainabilityBadge';
import AddSustainabilityBadge from './pages/Sustainability/AddSustainabilityBadge';

import FoodWasteLogs from './pages/FoodWaste/FoodWasteLogs';
import EditFoodWasteLogs from './pages/FoodWaste/EditFoodWasteLog';
import AddFoodWasteLogs from './pages/FoodWaste/AddFoodWasteLog';

import Error from './pages/Others/Error';
import Report from './pages/Others/Report';
import AdminDashboard from './pages/Others/AdminDashboard';

import ResourceTypes from './pages/Admin/resources/ResourceTypes';
import AddResourceType from './pages/Admin/resources/AddResourceType';
import EditResourceType from './pages/Admin/resources/EditResourceType';
import AddResource from './pages/Admin/resources/AddResource';
import Resources from './pages/Admin/resources/Resources';
import EditResource from './pages/Admin/resources/EditResource';

import AddAttribute from './pages/Admin/attributes/AddAttribute';
import EditAttribute from './pages/Admin/attributes/EditAttribute';
import Attributes from './pages/Admin/attributes/Attributes';

import AddUserAttribute from './pages/Admin/attributes/AddUserAttribute';
import EditUserAttribute from './pages/Admin/attributes/EditUserAttribute';
import UserAttributes from './pages/Admin/attributes/UserAttributes';

function AppContent() {
  // useLocation is available here inside the Router.
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isAllowedViewReport, setIsAllowedViewReport] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
    Promise.all([
      http.get("/userattributes/attr?attribute=admin"),
      http.get("/userattributes/attr?attribute=view_report")
    ]).then(([adminRes, viewReportRes]) => {
      setIsAdmin(adminRes.data);
      if (adminRes.data === true) {
        setIsAllowedViewReport(true);
      } else {
        setIsAllowedViewReport(viewReportRes.data);
      }
      console.log(viewReportRes.data);
      console.log(adminRes.data);
    });
    setLoading(false);
  }, []);

  // Redirect if user is logged in, hasn't completed profile, and isn't already on /complete-profile
  useEffect(() => {
    if (
      !loading &&
      user &&
      user.completeProfile === false &&
      location.pathname !== '/complete-profile'
    ) {
      window.location.href = '/complete-profile';
    }
  }, [loading, user, location]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {/* Only render the nav bar if NOT on /complete-profile */}
      {!loading && location.pathname !== '/complete-profile' && (
        <main className="container">
          <nav style={{ paddingBlock: "0.75rem" }} >
            <ul>
              <li>
                <a href="/">
                  <strong>RecipeRight</strong>
                </a>
              </li>
              <li></li>
              {user && (
                <>
                  <li>
                    <details className="dropdown">
                      <summary>
                        {(() => {
                          // Dynamically update dropdown title based on the current path
                          const path = window.location.pathname;
                          let title = "Recipes";
                          if (path.startsWith("/pantry")) {
                            title = "Pantry";
                          } else if (path.startsWith("/bookmarks")) {
                            title = "Bookmarks";
                          }
                          return title;
                        })()}
                      </summary>
                      <ul>
                        <li><a href="/pantry">Pantry</a></li>
                        <li><a href="/bookmarks">Bookmarks</a></li>
                      </ul>
                    </details>
                  </li>

                  <li></li>

                  <li>
                    <a href="/sustainability-goals"> Sustainability </a>
                  </li>

                  <li></li>

                  <li>
                    <details className="dropdown">
                      <summary> Resources </summary>
                      <ul>
                        <li><a href="/resources">View Resources</a></li>
                        <li><a href="/resourcetypes"> View Resource Types </a></li>
                      </ul>
                    </details>
                  </li>

                  <li></li>

                  <li>
                    <details className="dropdown">
                      <summary> Attributes </summary>
                      <ul>
                        <li><a href="/attributes"> Attributes </a></li>
                        <li><a href="/userattributes"> User Attributes </a></li>
                      </ul>
                    </details>
                  </li>

                  <li></li>

                  {isAllowedViewReport && (
                    <li>
                      <a href="/report"> Generate Report </a>
                    </li>
                  )}
                </>
              )}
            </ul>
            {user && (
              <ul>
                <li>
                  <button className="secondary">
                    <a href="/profile" className="contrast">{user.name}</a>
                  </button>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </ul>
            )}
            {!user && (
              <ul>
                <li>
                  <button>
                    <a href="/register" className="contrast">Register</a>
                  </button>
                </li>
                <li>
                  <button className="secondary">
                    <a href="/login" className="contrast">Login</a>
                  </button>
                </li>
              </ul>
            )}
          </nav>
        </main>
      )}

      <Container>
        <Routes>
          <Route path={"/register"} element={
            <>
              {!user && (<Register />)}
              {user && (<Error />)}
            </>
          } />
          <Route path={"/login"} element={
            <>
              {!user && (<Login />)}
              {user && (<Error />)}
            </>
          } />

          <Route path={"/profile"} element={
            <>
              {user && (<Profile />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/edit-profile"} element={
            <>
              {user && (<EditProfile />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/security"} element={
            <>
              {user && (<Security />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path="/forgotpassword" element={
            <>
              {user && (<Error />)}
              {!user && (<ForgotPassword />)}
            </>
          } />
          <Route path={"/complete-profile"} element={
            <>
              {user && (<CompleteProfile />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/verify-2fa" element={<TwoFactorAuth />} />

          {/* TODO: Add admin dashboard */}
          <Route path={"/admin/dashboard"} element={
            <>
              {user && isAdmin && (
                <AdminDashboard />
              )}
              {(!user || !isAdmin) && (
                <Error />
              )}
            </>
          } />

          <Route path={"/pantry"} element={
            <>
              {user && (<Pantry />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/recipe/:id"} element={
            <>
              {user && (<RecipeDetails />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/bookmarks"} element={
            <>
              {user && (<Bookmarks />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/fridge"} element={
            <>
              {user && (<Fridge />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path="/chatbot" element={
            <>
              {user && (<Chatbot />)}
              {!user && (<Error />)}
            </>
          } />

          <Route path={"/add-sustainability-goal"} element={
            <>
              {user && (<AddSustainabilityGoal />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/edit-sustainability-goal/:id"} element={
            <>
              {user && (<EditSustainabilityGoal />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path="/sustainability-goals" element={
            <>
              {user && (<SustainabilityGoals />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path="/sustainability-badges" element={
            <>
              {user && (<SustainabilityBadges />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path="/add-sustainability-badge" element={
            <>
              {user && (<AddSustainabilityBadge />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path="/edit-sustainability-badge/:id" element={
            <>
              {user && (<EditSustainabilityBadge />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path="/food-waste-logs" element={
            <>
              {user && (<FoodWasteLogs />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path="/edit-food-waste-entry/:id" element={
            <>
              {user && (<EditFoodWasteLogs />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path="/add-food-waste-entry" element={
            <>
              {user && (<AddFoodWasteLogs />)}
              {!user && (<Error />)}
            </>
          } />

          <Route path={"resourcetypes"} element={
            <>
              {user && isAdmin && (<ResourceTypes />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"addresourcetype"} element={
            <>
              {user && isAdmin && (<AddResourceType />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/editresourcetype/:id"} element={
            <>
              {user && isAdmin && (<EditResourceType />)}
              {!user && (<Error />)}
            </>
          } />

          <Route path={"/resources"} element={
            <>
              {user && isAdmin && (<Resources />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/addresource"} element={
            <>
              {user && isAdmin && (<AddResource />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/editresource/:id"} element={
            <>
              {user && isAdmin && (<EditResource />)}
              {!user && (<Error />)}
            </>
          } />

          <Route path={"/attributes"} element={
            <>
              {user && isAdmin && (<Attributes />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/addattribute"} element={
            <>
              {user && isAdmin && (<AddAttribute />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/editattribute/:id"} element={
            <>
              {user && isAdmin && (<EditAttribute />)}
              {!user && (<Error />)}
            </>
          } />

          <Route path={"/userattributes"} element={
            <>
              {user && isAdmin && (<UserAttributes />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/adduserattribute"} element={
            <>
              {user && isAdmin && (<AddUserAttribute />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/edituserattribute/:id"} element={
            <>
              {user && isAdmin && (<EditUserAttribute />)}
              {!user && (<Error />)}
            </>
          } />
          <Route path={"/report"} element={
            <>
              {user && isAllowedViewReport && (<Report />)}
              {(!user || !isAllowedViewReport) && (<Error />)}
            </>
          } />

          <Route path="/" element={
            <>
              {!user && (<Login />)}
              {user && (<Pantry />)}
            </>
          } />
        </Routes>
      </Container>
    </UserContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
