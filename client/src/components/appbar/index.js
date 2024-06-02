import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiURL } from '../../utils.js';
import { UserContext } from '../UserContext.js';

const AppBar = () => {
  const { currentUser, _, removeCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const setupLoginURL = async () => {
    let url =
      'https://greatnotes-security-levelup.auth.eu-west-1.amazoncognito.com/login?response_type=code&';
    url +=
      'redirect_uri=' +
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://great-notes.projects.bbdgrad.com') +
      '/login';
    let getClientIdUrl = getApiURL() + '/api/auth/client_id';
    console.log('getClientIdUrl', getClientIdUrl);
    url = await fetch(getClientIdUrl)
      .then(async (res) => {
        if (!res.ok) {
          res.json().then((data) => {
            alert(data);
          });
          return;
        } else {
          return await res.json().then(async (data) => {
            url += '&client_id=' + data;
            return url;
          });
        }
      })
      .catch((err) => {
        alert('API down!', err);
        return;
      });
    return url;
  };

  const onLogin = async () => {
    let url = await setupLoginURL();
    if (url === undefined) {
      return;
    }
    window.location.href = url;
  };

  const onLogout = () => {
    removeCurrentUser();
    navigate("/");
  };

  return (
    <div className="app-bar bg-red-500">
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
          <li>
            {!currentUser && <button onClick={onLogin}>Login</button>}
            {currentUser && <button onClick={onLogout}>Logout</button>}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AppBar;
