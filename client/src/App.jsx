import './App.css';
import { useState, useEffect } from 'react';
import { Container, } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import http from './http';
import UserContext from './contexts/UserContext';

import ResourceTypes from './pages/resources/ResourceTypes';
import AddResourceType from './pages/resources/AddResourceType';
import EditResourceType from './pages/resources/EditResourceType';
import AddResource from './pages/resources/AddResource';
import Resources from './pages/resources/Resources';
import EditResource from './pages/resources/EditResource';

import AddAttribute from './pages/attributes/AddAttribute';
import EditAttribute from './pages/attributes/EditAttribute';
import Attributes from './pages/attributes/Attributes';

import AddUserAttribute from './pages/attributes/AddUserAttribute'
import EditUserAttribute from './pages/attributes/EditUserAttribute';
import UserAttributes from './pages/attributes/UserAttributes';

import Home from './pages/Home';
import Report from './pages/Report';
import Error from './pages/Error';
import Register from './pages/Register';
import Login from './pages/Login';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAllowedViewReport, setIsAllowedViewReport] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
      Promise.all([
        http.get("/userattributes/attr?attribute=admin"),
        http.get("/userattributes/attr?attribute=view_report")
      ]).then(([adminRes, viewReportRes]) => {
        if (adminRes.data == true) {
          setIsAllowedViewReport(true)
        }
        else {
          setIsAllowedViewReport(viewReportRes.data)
        }
        console.log(viewReportRes.data);
        console.log(adminRes.data);
      });
    }
    setLoading(false);
  }, []);


  const logout = () => {
    localStorage.clear();
    window.location = "/";
  }

  return (

    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        {loading && (
          <h3 aria-busy="true"> Loading...</h3>
        )}
        {!loading && (
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
                          Resources
                        </summary>
                        <ul>
                          <li><a href="/resources">View Resources</a></li>
                          <li>
                            <a href="/resourcetypes"> View Resource Types </a>
                          </li>
                        </ul>
                      </details>
                    </li>
                    <li></li>
                    <li>
                      <details className="dropdown">
                        <summary>
                          Attributes
                        </summary>
                        <ul>
                          <li>
                            <a href="/attributes"> Attributes </a>
                          </li>
                          <li>
                            <a href="/userattributes"> User Attributes </a>
                          </li>
                        </ul>
                      </details>
                    </li>
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
                  <li>{user.name}</li>
                  <li><button onClick={logout}>Logout</button></li>
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

            <Container>
              <Routes>
                <Route path={"resourcetypes"} element={
                  <>
                    {user && (<ResourceTypes />)}
                    {!user && (<Error />)}
                  </>
                } />
                <Route path={"addresourcetype"} element={
                  <>
                    {user && (<AddResourceType />)}
                    {!user && (<Error />)}
                  </>
                } />
                <Route path={"/editresourcetype/:id"} element={
                  <>
                    {user && (<EditResourceType />)}
                    {!user && (<Error />)}
                  </>
                } />

                <Route path={"/resources"} element={
                  <>
                    {user && (<Resources />)}
                    {!user && (<Error />)}
                  </>
                } />
                <Route path={"/addresource"} element={
                  <>
                    {user && (<AddResource />)}
                    {!user && (<Error />)}
                  </>
                } />
                <Route path={"/editresource/:id"} element={
                  <>
                    {user && (<EditResource />)}
                    {!user && (<Error />)}
                  </>
                } />

                <Route path={"/attributes"} element={
                  <>
                    {user && (<Attributes />)}
                    {!user && (<Error />)}
                  </>
                } />
                <Route path={"/addattribute"} element={
                  <>
                    {user && (<AddAttribute />)}
                    {!user && (<Error />)}
                  </>
                } />
                <Route path={"/editattribute/:id"} element={
                  <>
                    {user && (<EditAttribute />)}
                    {!user && (<Error />)}
                  </>
                } />

                <Route path={"/userattributes"} element={
                  <>
                    {user && (<UserAttributes />)}
                    {!user && (<Error />)}
                  </>
                } />
                <Route path={"/adduserattribute"} element={
                  <>
                    {user && (<AddUserAttribute />)}
                    {!user && (<Error />)}
                  </>
                } />
                <Route path={"/edituserattribute/:id"} element={
                  <>
                    {user && (<EditUserAttribute />)}
                    {!user && (<Error />)}
                  </>
                } />
                <Route path={"/report"} element={
                  <>
                    {user && isAllowedViewReport && (<Report />)}
                    {(!user || !isAllowedViewReport) && (<Error />)}
                  </>
                } />

                <Route path={"/"} element={<Home />} />
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
                <Route path={"/*"} element={ <Error /> } />
              </Routes>
            </Container>
          </main>
        )}

      </Router>
    </UserContext.Provider>
  );
}