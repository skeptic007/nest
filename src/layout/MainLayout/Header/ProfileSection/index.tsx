import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useAuth from 'hooks/useAuth';

// types
import { ThemeMode } from 'types/config';

// assets
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import useConfig from 'hooks/useConfig';

const User1 = '/assets/images/users/user-round.svg';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const { borderRadius } = useConfig();
  // const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef<any>(null);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement>, index: number, route: string = '') => {
    setSelectedIndex(index);
    handleClose(event);

    // if (route && route !== '') {
    //     navigate(route);
    // }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: 'primary.main',
            bgcolor: `${theme.palette.primary.main} !important`,
            color: 'primary.light',
            '& svg': {
              stroke: theme.palette.primary.main
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={User1}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
            alt="user images"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="h4">Good Morning,</Typography>
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            {user?.name}
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2">Project Admin</Typography>
                      </Stack>
                    </Box>
                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <List
                          component="nav"
                          sx={{
                            width: '100%',
                            maxWidth: 350,
                            minWidth: 300,
                            bgcolor: theme.palette.background.paper,
                            borderRadius: `${borderRadius}px`,
                            '& .MuiListItemButton-root': { mt: 0.5 }
                          }}
                        >
                          <ListItemButton
                            sx={{ borderRadius: `${borderRadius}px` }}
                            selected={selectedIndex === 0}
                            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                              handleListItemClick(event, 0, '/user/account-profile/profile1')
                            }
                          >
                            <ListItemIcon>
                              <IconSettings stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  <FormattedMessage id="account-settings" />
                                </Typography>
                              }
                            />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ borderRadius: `${borderRadius}px` }}
                            selected={selectedIndex === 1}
                            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                              handleListItemClick(event, 1, '/user/social-profile/posts')
                            }
                          >
                            <ListItemIcon>
                              <IconUser stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Grid container spacing={1} justifyContent="space-between">
                                  <Grid item>
                                    <Typography variant="body2">
                                      <FormattedMessage id="social-profile" />
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <Chip label="02" size="small" color="warning" sx={{ '& .MuiChip-label': { mt: 0.25 } }} />
                                  </Grid>
                                </Grid>
                              }
                            />
                          </ListItemButton>
                          <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4} onClick={handleLogout}>
                            <ListItemIcon>
                              <IconLogout stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  <FormattedMessage id="logout" />
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </List>
                      </Box>
                    </PerfectScrollbar>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
