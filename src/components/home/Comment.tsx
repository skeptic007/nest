import { Grid, Typography, ButtonBase, Menu, MenuItem, Card } from '@mui/material';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import { useState } from 'react';
import Avatar from 'ui-component/extended/Avatar';
import { ThemeMode } from 'types/config';
import { useTheme } from '@mui/material/styles';
import useFetchImage from 'hooks/useFetchImage';

const fallbackProfile = '/assets/images/users/loadingprofile.jpg';

const CommentView: React.FC<any> = ({ comment }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const avatarKey = comment?.commentedBy?.profile?.avatar || comment?.userDetails?.avatar;
  const { imageUrl: commenterImageUrl } = useFetchImage(avatarKey);

  const firstName = comment?.commentedBy?.firstName || comment?.userDetails?.firstName;
  const lastName = comment?.commentedBy?.lastName || comment?.userDetails?.lastName;
  const content = comment.content;

  return (
    <Grid item xs={12}>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Grid container wrap="nowrap" alignItems="center" spacing={1}>
          <Grid item>
            <Avatar sx={{ width: 32, height: 32 }} size="sm" alt={fallbackProfile} src={commenterImageUrl || fallbackProfile} />
          </Grid>
          <Grid item xs zeroMinWidth>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="h5">
                  {firstName} {lastName}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <ButtonBase sx={{ borderRadius: '12px' }} aria-label="more options">
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.smallAvatar,
                  bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
                  color: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
                  zIndex: 1,
                  transition: 'all .2s ease-in-out',
                  '&:hover': {
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
                    color: theme.palette.mode === ThemeMode.DARK ? 'grey.800' : 'secondary.light'
                  },
                  '&[aria-controls="menu-list-grow"],&:hover': {
                    background: theme.palette.secondary.main,
                    color: theme.palette.secondary.light
                  }
                }}
                aria-controls="menu-comment"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                <MoreVertTwoToneIcon fontSize="inherit" />
              </Avatar>
            </ButtonBase>
            <Menu
              id="menu-comment"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              variant="selectedMenu"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
              <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Grid>
      <Card sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.50', p: 2, mt: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="body2">{content}</Typography>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default CommentView;
