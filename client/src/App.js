import React, { useState } from "react" // Optional for React 17+
import "./App.css";
import MarkdownEditor from "./routes/mardown-editor/index.js"; // Consider adding .js
import Login from "./routes/login/index.js";
import { BrowserRouter as Router, Route, Routes, json } from "react-router-dom";
import AppBar from "./components/appbar/index.js"; // Consider adding .js
import { UserContext } from "./components/UserContext.js";
import { parseJwt } from "./utils.js";


export default function App() {
  let userFromStorage = window.localStorage.getItem('greatnotes-user');
  let user = userFromStorage ? JSON.parse(userFromStorage) : null;
  const [currentUser, setCurrentUserState] = useState(user);
  
  const setCurrentUser = async (user) => {
    let userInfo = parseJwt(user['id_token']);
    let userLocal = user;
    userLocal["name"] = userInfo["name"];
    userLocal["picture"] = userInfo["picture"];
    window.localStorage.setItem('greatnotes-user', JSON.stringify(userLocal));
    setCurrentUserState(userLocal);
  }

  const removeCurrentUser = () => {
    window.localStorage.removeItem('greatnotes-user');
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
