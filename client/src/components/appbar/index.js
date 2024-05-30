import React from "react"
import {Link } from 'react-router-dom';

const AppBar = ()=>{
    return    ( <div className="app-bar bg-red-500">
    <div className="app-bar__logo">
      <Link to="/">Logo</Link>
    </div>
    <nav className="app-bar__nav">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/editor">New note</Link>
        </li>
      </ul>
    </nav>
  </div>)
}

export default AppBar;