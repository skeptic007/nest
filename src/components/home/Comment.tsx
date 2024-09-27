import { Avatar, Grid, Typography } from '@mui/material';

type CommentProps = {
  profileImage: string;
  commenterName: string;
  commentText: string;
};

const CommentView: React.FC<CommentProps> = ({ profileImage, commenterName, commentText }) => {
  return (
    <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '10px' }}>
      <Grid item>
        <Avatar src={profileImage} alt={commenterName} />
      </Grid>
      <Grid item xs>
        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
          {commenterName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {commentText}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CommentView;
