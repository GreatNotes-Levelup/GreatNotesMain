import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLoginURL } from '../../utils.js';
import useAuth from '../UserContext.js';
import { AppBar as MAppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { Menu as MenuIcon, ArrowBack } from '@mui/icons-material';
import './styles.css';

const AppBar = () => {
  const { user, removeCurrentUser } = useAuth();
  const navigate = useNavigate();
  // User menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const onLogin = async () => {
    let url = await getLoginURL();
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

  // Not useful since the user is always logged in if they see the button, but nice to have
  const getBestHomeLink = () => {
    return user ? "/dashboard" : "/";
  }

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
          {!user && <Button onClick={onLogin}>Login</Button>}
          {user &&
            <ul>
              <li>
                <Link to={getBestHomeLink()}>
                  <Button>Home</Button>
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
                    {user.name}
                    <Avatar src={user.picture} />
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
