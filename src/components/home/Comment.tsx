import { Grid, Typography, ButtonBase, Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import { useState } from 'react';
import Avatar from 'ui-component/extended/Avatar';
import { GET_IMAGE_URL } from 'graphql/queries';
import { useQuery } from '@apollo/client';

const CommentView: React.FC<any> = ({ comment }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const { data } = useQuery(GET_IMAGE_URL, {
    variables: { imageUrlKey: { key: comment.commentedBy.profile.avatar } },
    skip: !comment.commentedBy.profile.avatar
  });

  const commenterImageUrl = data?.getImageUrl || '';

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      sx={{ marginBottom: '10px', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}
    >
      <Grid item>
        <Avatar src={commenterImageUrl} alt={comment.commentedBy.firstName} />
      </Grid>
      <Grid item xs>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {comment.commentedBy.firstName} {comment.commentedBy.lastName}
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
          {comment.content}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CommentView;
