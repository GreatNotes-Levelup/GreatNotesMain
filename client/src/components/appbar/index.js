import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLoginURL } from '../../utils.js';
import useAuth from '../UserContext.js';

import {
  AppBar as MAppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme 
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import './styles.css';

const AppBar = () => {
  const { user, removeCurrentUser } = useAuth();
  const navigate = useNavigate();
  // User menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();

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

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawerNavItems = [
    {name: "Home", link: getBestHomeLink(), authNeeded: false},
    {name: "Login", onClick: onLogin, unAuthed: true},
    {name: "Logout", onClick: onLogout, authNeeded: true}

  ];

  const drawerWidth = 240;
  const container = window !== undefined ? () => window.document.body : undefined;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
    <Typography variant="h6" sx={{ my: 2 }}>
      GreatNotes
    </Typography>
    <Divider />
    <List>
      {drawerNavItems.map((item) => {
        if (user && item.authNeeded || !user && item.unAuthed || item.authNeeded === false) {
          return (
            <Link key={item.name} to={item.link ? item.link : '#'}>
              <ListItem disablePadding>
                <ListItemButton sx={{ textAlign: 'center' }} onClick={item.onClick ? item.onClick : () => {}}>
                  <ListItemText primary={item.name} sx={{ color: theme.palette.primary.main }}/>
                </ListItemButton>
              </ListItem>
            </Link>
          );
        }
      })}
    </List>
  </Box>
  );

  return (
    <Box>
      <MAppBar position="static">
        <Toolbar className="nav-bar-root">
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            GreatNotes
          </Typography>
          <nav className="app-bar__nav">
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {!user && <Button onClick={onLogin}>Login</Button>}
          {user &&
            <ul>
              <li>
                <Link to={getBestHomeLink()}>
                  <Button>Home</Button>
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
          </Box>
          {user && <Avatar src={user.picture} sx={{ display: { sm: 'none' } }}/>}

          </nav>
        </Toolbar>
      </MAppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default AppBar;
