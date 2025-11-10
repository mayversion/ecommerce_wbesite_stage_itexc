import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/userActions';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  InputBase,
  alpha,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Search as SearchIcon,
  Menu as MenuIcon,
  Home,
  Store,
  AccountCircle,
  ExitToApp,
  AdminPanelSettings
} from '@mui/icons-material';

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

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.cart);
  const [logoError, setLogoError] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${searchKeyword}`);
    }
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/me'); handleMenuClose(); }}>
        <AccountCircle sx={{ mr: 1 }} />
        Profile
      </MenuItem>
      <MenuItem onClick={() => { navigate('/orders/me'); handleMenuClose(); }}>
        <ShoppingCart sx={{ mr: 1 }} />
        My Orders
      </MenuItem>
      {user && user.role === 'admin' && (
        <MenuItem onClick={() => { navigate('/admin/dashboard'); handleMenuClose(); }}>
          <AdminPanelSettings sx={{ mr: 1 }} />
          Dashboard
        </MenuItem>
      )}
      <MenuItem onClick={handleLogout}>
        <ExitToApp sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>
        <Home sx={{ mr: 1 }} />
        Home
      </MenuItem>
      <MenuItem onClick={() => { navigate('/products'); handleMenuClose(); }}>
        <Store sx={{ mr: 1 }} />
        Products
      </MenuItem>
      <MenuItem onClick={() => { navigate('/cart'); handleMenuClose(); }}>
        <Badge badgeContent={cartItems.length} color="secondary">
          <ShoppingCart />
        </Badge>
        Cart
      </MenuItem>
      {isAuthenticated ? (
        <>
          <MenuItem onClick={() => { navigate('/me'); handleMenuClose(); }}>
            <AccountCircle sx={{ mr: 1 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate('/orders/me'); handleMenuClose(); }}>
            <ShoppingCart sx={{ mr: 1 }} />
            My Orders
          </MenuItem>
          {user && user.role === 'admin' && (
            <MenuItem onClick={() => { navigate('/admin/dashboard'); handleMenuClose(); }}>
              <AdminPanelSettings sx={{ mr: 1 }} />
              Dashboard
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>
            <ExitToApp sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }}>
            <Person sx={{ mr: 1 }} />
            Login
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar
      position="sticky"
      className={scrolled ? 'appbar-glass is-scrolled' : 'appbar-glass'}
      sx={{
        backgroundColor: scrolled ? 'rgba(17,20,40,0.65)' : 'rgba(17,20,40,0.35)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        boxShadow: scrolled ? '0 8px 24px rgba(0,0,0,0.18)' : 'none',
        transition: 'all .25s ease',
        zIndex: (t) => t.zIndex.appBar
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: scrolled ? 72 : 80 }, transition: 'min-height .25s ease' }}>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', mr: 2 }}>
          <Box component={Link} to="/" className="logo-link logo-anim" sx={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', position: 'relative' }}>
            {!logoError ? (
              <Box component="img"
                   src={logo}
                   alt=""
                   draggable={false}
                   onError={() => setLogoError(true)}
                   sx={{ width: { xs: 56, md: 72 }, height: { xs: 56, md: 72 }, display: 'block', objectFit: 'cover', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)' }} />
            ) : (
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#EC4899,#8B5CF6)', boxShadow: '0 8px 20px rgba(236,72,153,.35)' }} />
            )}
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Search className="search-pill">
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <form onSubmit={handleSearchSubmit}>
            <StyledInputBase
              placeholder="Search products..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </form>
        </Search>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<Home />}
            className="nav-link"
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/products"
            startIcon={<Store />}
            className="nav-link"
          >
            Products
          </Button>
          <IconButton
            size="large"
            aria-label="show cart items"
            color="inherit"
            component={Link}
            to="/cart"
          >
            <Badge badgeContent={cartItems.length} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {isAuthenticated && user && user.role === 'admin' && (
            <Button
              color="inherit"
              component={Link}
              to="/admin/dashboard"
              startIcon={<AdminPanelSettings />}
            >
              Dashboard
            </Button>
          )}

          {isAuthenticated ? (
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                startIcon={<Person />}
                className="nav-link"
              >
                Login
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
      {renderMobileMenu}
      {renderMenu}
    </AppBar>
  );
};

export default Header;
