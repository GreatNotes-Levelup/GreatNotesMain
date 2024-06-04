import React from "react" // Optional for React 17+
import "./App.css";
import MarkdownEditor from "./routes/mardown-editor/index.js"; // Consider adding .js
import Login from "./routes/login/index.js";
import Home from "./routes/home/index.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppBar from "./components/appbar/index.js"; // Consider adding .js
import { UserProvider } from "./components/UserContext.js";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./AppTheme.js";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import Dashboard from "./routes/dashboard/index.js";

export default function App() {
    return (
      <UserProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <div className="app">
              <AppBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/editor" element={<MarkdownEditor />} />
                  <Route path="/dashboard" element={<Dashboard/>}/>
                </Route>
                <Route path="*" element={<h1>404 Not found</h1>} />

              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </UserProvider>
    );
}
