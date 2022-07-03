import React from 'react';
import AppBar, { AppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link as RouterLink } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { useTranslation } from 'react-i18next';
import { User } from 'firebase/auth';
import styled from '@emotion/styled';
import Check from '@mui/icons-material/Check';
import { default as LogoutIcon } from '@mui/icons-material/Logout';
import packagejson from '../../package.json';
import { ReactComponent as LogoSVG } from '../icons/logo.svg';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

export type HeaderProps = AppBarProps & {
  onLogoutClick: () => void;
  user: User;
};

const Header = (props: HeaderProps) => {
  const {
    position = 'fixed',
    onLogoutClick = () => {},
    user,
    ...other
  } = props;
  const { t } = useTranslation();

  return (
    <AppBar position={position} {...other} className="app-header">
      <Toolbar>
        <Box display="flex" flex={1} justifyContent="space-between">
          <Link
            component={RouterLink}
            to={'/'}
            variant="h6"
            color="inherit"
            underline="none"
          >
            <Box display="flex" alignItems="center" p={1}>
              <LogoSVG width={32} height={32} />
              <Typography variant="h6" pl={1}>
                {t('main')}
              </Typography>
            </Box>
          </Link>
        </Box>
        <Box>
          <LanguageMenu />
          <UserMenu
            userAvatar={user?.photoURL ?? ''}
            userName={user?.displayName ?? ''}
            userEmail={user?.email ?? ''}
            onLogoutClick={() => {
              onLogoutClick();
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

type LogOutUserMenuProps = {
  onLogoutClick: () => void;
  userAvatar: string;
  userName: string | null;
  userEmail: string | null;
};

// TODO: theme.palette...
const EventsPaper = styled(Paper)(() => ({
  background: 'linear-gradient(to top, #212121, #212121 75%, #333 75%)',
}));

const UserMenu = (props: LogOutUserMenuProps) => {
  const { onLogoutClick = () => {}, userAvatar, userName, userEmail } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  return (
    <>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar src={userAvatar} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        sx={{
          '* > ul': {
            padding: 0,
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <EventsPaper elevation={0}>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Box mt={5} display="flex" justifyContent="center">
              <Avatar
                src={userAvatar}
                sx={{ width: 56, height: 56, margin: 0 }}
              />
            </Box>
            <CardContent>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                pl={4}
                pr={4}
              >
                <Typography variant="subtitle1" color="textPrimary">
                  {userName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {userEmail}
                </Typography>
              </Box>
            </CardContent>
            <Divider variant="middle" />
            <Box pl={2} pr={2} pb={2}>
              <IconButton
                onClick={onLogoutClick}
                color="inherit"
                sx={{
                  width: '100%',
                  borderRadius: '0',
                  justifyContent: 'flex-start',
                }}
              >
                <LogoutIcon />
                <Typography pl={2}>{t('signOut')}</Typography>
              </IconButton>
              <Divider />
              <Typography
                variant="caption"
                component="p"
                textAlign="center"
                pt={1}
                color="grey.500"
              >
                {t('appVersion', { version: `${packagejson.version}` })}
              </Typography>
            </Box>
          </Box>
        </EventsPaper>
      </Menu>
    </>
  );
};

const LanguageMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const { i18n, t } = useTranslation();

  const availableLanguages: string[] = Object.keys(i18n.store.data);

  return (
    <>
      <Button onClick={handleMenu} color="inherit">
        {t(i18n.language)}
      </Button>
      <Menu
        anchorEl={anchorEl}
        sx={{
          '* > ul': {
            padding: 0,
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <Paper>
          <MenuList>
            {availableLanguages.map((l: string) => {
              return (
                <MenuItem
                  onClick={() => {
                    i18n.changeLanguage(l);
                    handleClose();
                  }}
                  key={l}
                  sx={{
                    justifyContent:
                      l === i18n.language ? 'space-between' : 'flex-end',
                  }}
                >
                  {l === i18n.language && (
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                  )}
                  {t(l)}
                </MenuItem>
              );
            })}
          </MenuList>
        </Paper>
      </Menu>
    </>
  );
};

export default Header;
