import React, { useState } from "react" // Optional for React 17+
import "./App.css";
import MarkdownEditor from "./routes/mardown-editor/index.js"; // Consider adding .js
import Login from "./routes/login/index.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppBar from "./components/appbar/index.js"; // Consider adding .js
import { UserContext } from "./components/UserContext.js";


export default function App() {
  let accessToken = window.localStorage.getItem('greatnotes-access-token')
  let user = null;
  if (accessToken) {
    user = {
      accessToken: window.localStorage.getItem('greatnotes-access-token'),
      refreshToken: window.localStorage.getItem('greatnotes-refresh-token')
    }
  }
  const [currentUser, setCurrentUserState] = useState(user);

  const setCurrentUser = (user) => {
    window.localStorage.setItem('greatnotes-access-token', user['access_token']);
    window.localStorage.setItem('greatnotes-refresh-token', user['refresh_token']);
    setCurrentUserState({
      accessToken: user['access_token'],
      refreshToken: user['refresh_token']
    });
  }

  const removeCurrentUser = () => {
    window.localStorage.removeItem('greatnotes-access-token');
    window.localStorage.removeItem('greatnotes-refresh-token');
    setCurrentUserState(null);
  }


    return (
      <UserContext.Provider value={{currentUser, setCurrentUser, removeCurrentUser}}>
      <Router>
        <div className="app">
          <AppBar />
          <div className="body">
            <Routes>
              <Route path="/" element={<MarkdownEditor />} /> 
              <Route path="/login" element={<Login />} /> 
              <Route path="*" element={<h1>404 Not found</h1>} />
            </Routes>
          </div>
        </div>
      </Router>
      </UserContext.Provider>
    );
}
