import './App.css';
import { useState, useEffect } from 'react';
import { Container, } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <main className="container">
          <nav style={{paddingBlock: "0.75rem"}} >
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
                    <a href="/policies"> Policies </a>
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
                </>
              )}
            </ul>
            {user && (
              <ul>
                {/* TODO: Have this redirect to settings */}
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
              <Route path={"resourcetypes"} element={<ResourceTypes />} />
              <Route path={"addresourcetype"} element={<AddResourceType />} />
              <Route path={"/editresourcetype/:id"} element={<EditResourceType />} />


              <Route path={"/resources"} element={<Resources />} />
              <Route path={"/addresource"} element={<AddResource />} />
              <Route path={"/editresource/:id"} element={<EditResource />} />

              <Route path={"/"} element={<Home />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
            </Routes>
          </Container>
        </main>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
