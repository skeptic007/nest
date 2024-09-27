import { Grid, Typography, ButtonBase, Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import { useState } from 'react';
import Avatar from 'ui-component/extended/Avatar';

type CommentProps = {
  profileImage: string;
  commenterName: string;
  commentText: string;
};

const CommentView: React.FC<CommentProps> = ({ profileImage, commenterName, commentText }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      sx={{ marginBottom: '10px', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}
    >
      <Grid item>
        <Avatar src={profileImage} alt={commenterName} />
      </Grid>
      <Grid item xs>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {commenterName}
            </Typography>
          </Grid>
          <Grid item>
            <ButtonBase>
              <IconButton onClick={handleMenuOpen} size="small">
                <MoreVertTwoToneIcon />
              </IconButton>
            </ButtonBase>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
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
        <Typography variant="body2" sx={{ marginTop: '5px', color: 'textSecondary' }}>
          {commentText}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CommentView;
