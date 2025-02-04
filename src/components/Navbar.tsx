import { useState } from 'react';
import {
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import GitHub from '@mui/icons-material/GitHub';
import Article from '@mui/icons-material/Article';
import Logout from '@mui/icons-material/Logout';
import Login from '@mui/icons-material/Login';
import Avatar from '@mui/material/Avatar';
import { useAuth0 } from '@auth0/auth0-react';
import { enableAuth } from '../utils/constants';
import packageJson from '../../package.json';
import logo from '../assets/logo.png';

function Navbar({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openAccountMenu = Boolean(anchorEl);

  const { user, logout } = useAuth0();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar className="my-4" data-cy="navbar">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="Logo" height="60" />
          <div className="ml-4">
            <Badge badgeContent={packageJson.version || 'beta'}>
              <Typography variant="h5">Neurobagel Query</Typography>
            </Badge>
            <Typography className="text-gray-500">
              Define and find cohorts at the subject level
            </Typography>
          </div>
        </div>
        <div className="flex">
          <Tooltip title="Documentation">
            <IconButton
              size="small"
              href="https://neurobagel.org/user_guide/query_tool/"
              target="_blank"
            >
              <Article />
            </IconButton>
          </Tooltip>
          <IconButton href="https://github.com/neurobagel/query-tool/" target="_blank">
            <GitHub />
          </IconButton>
          {enableAuth && (
            <>
              <IconButton onClick={handleClick}>
                <Avatar
                  src={user?.picture ?? ''}
                  sx={{ width: 30, height: 30 }}
                  alt={user?.name ?? ''}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openAccountMenu}
                onClose={handleClose}
                onClick={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MenuItem>
                    <Avatar src={user?.picture ?? ''} alt={user?.name ?? ''} />
                  </MenuItem>
                </div>
                {isLoggedIn ? (
                  <>
                    <MenuItem>
                      <Typography>Logged in as {user?.name ?? ''}</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    >
                      <ListItemIcon className="mr-[-8px]">
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem onClick={onLogin} data-cy="login-button">
                    <ListItemIcon className="mr-[-8px]">
                      <Login fontSize="small" />
                    </ListItemIcon>
                    Login
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </div>
      </div>
    </Toolbar>
  );
}

export default Navbar;
