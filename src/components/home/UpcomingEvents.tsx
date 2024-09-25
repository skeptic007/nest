// material-ui
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
const Dashboard1 = '/assets/images/widget/dashboard-1.jpg';
const Dashboard2 = '/assets/images/widget/dashboard-2.jpg';

const mediaSX = {
  width: 90,
  height: 80,
  borderRadius: '12px'
};

// ===========================|| DATA WIDGET - LATEST POSTS CARD ||=========================== //

const UpcomingEvents = () => (
  <MainCard title="Upcoming Events" content={false}>
    <CardContent>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={12}>
              <CardMedia component="img" image={Dashboard1} title="image" sx={mediaSX} />
            </Grid>
            <Grid item xs={12} md={12} zeroMinWidth>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Event title goes here</Typography>
                  <Typography variant="caption">Jan 1,2025 | Kupondole</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <CardMedia component="img" image={Dashboard1} title="image" sx={mediaSX} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Event title goes here</Typography>
                  <Typography variant="caption">Jan 1,2025 | Kupondole</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <CardMedia component="img" image={Dashboard2} title="image" sx={mediaSX} />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Event title goes here</Typography>
                  <Typography variant="caption">Jan 1,2025 | Kupondole</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
    <Divider />
    <CardActions sx={{ justifyContent: 'flex-end' }}>
      <Button variant="text" color="secondary" size="medium">
        View All Events
      </Button>
    </CardActions>
  </MainCard>
);

export default UpcomingEvents;
