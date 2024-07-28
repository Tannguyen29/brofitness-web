import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Badge, Avatar, Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    color: theme.palette.text.primary,
    boxShadow: "none",
    width: '85%',
    marginLeft: '241px',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "rgb(244, 246, 248)",
  }));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function Header() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <StyledAppBar position="static">
      <Toolbar variant="dense">
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Box display="flex" alignItems="center">
            {showSearch ? (
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            ) : (
              <IconButton onClick={() => setShowSearch(true)} color="inherit" size="small">
                <SearchIcon />
              </IconButton>
            )}
          </Box>
          <Box>
            <IconButton color="inherit" size="small">
              🇬🇧
            </IconButton>
            <IconButton color="inherit" size="small">
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" size="small">
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>U</Avatar>
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Header;