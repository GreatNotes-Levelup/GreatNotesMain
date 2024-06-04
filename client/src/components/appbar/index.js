import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiURL } from '../../utils.js';
import { UserContext } from '../UserContext.js';
import { AppBar as MAppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { Menu as MenuIcon, ArrowBack } from '@mui/icons-material';
import './styles.css';

const AppBar = () => {
  const { currentUser, _, removeCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  // User menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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
    handleProfileClose();
    navigate('/');
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <MAppBar position="static">
        <Toolbar className="nav-bar-root">
        <Link to="/dashboard">
          <IconButton>
            <ArrowBack/>
          </IconButton>
          </Link>
          <nav className="app-bar__nav">
          {!currentUser && <Button onClick={onLogin}>Login</Button>}
          {currentUser &&
            <ul>
              <li>
                <Link to="/dashboard">
                  <Button >Home</Button>
                </Link>
              </li>
              <li>
                <Tooltip title="Account">
                  <Button
                    id="user-profile-button"
                    className="user-display"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleProfileClick}
                  >
                    {currentUser.name}
                    <Avatar src={currentUser.picture} />
                  </Button>
                </Tooltip>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleProfileClose}
                  MenuListProps={{
                    'aria-labelledby': 'user-profile-button',
                  }}
                >
                  <MenuItem onClick={onLogout}>Logout</MenuItem>
                </Menu>
              </li>
            </ul>
            }
          </nav>
        </Toolbar>
      </MAppBar>
    </Box>
  );
};

export default AppBar;
