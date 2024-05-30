import React, { Component } from "react" // Optional for React 17+
import "./App.css";
import MarkdownEditor from "./routes/mardown-editor/index.js"; // Consider adding .js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppBar from "./components/appbar/index.js"; // Consider adding .js

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <AppBar />
          <div className="body">
            <Routes>
              {<Route path="/" element={<MarkdownEditor />} /> }
              <Route component={<h1>404 Not found</h1>} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
