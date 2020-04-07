import React from 'react';
import Grid from '@material-ui/core/Grid';
import Title from 'components/Dashboard/Title';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grow from '@material-ui/core/Grow';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import useDataStore from '../data/dataStore';
import GitHubIcon from '@material-ui/icons/GitHub';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import { GLOBAL_PAPER_OPACITY } from '../utils/consts';
import { useLocation } from 'react-router-dom';
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';

const useStyles = makeStyles((theme) => ({
  paper: {
    opacity: `${GLOBAL_PAPER_OPACITY} !important`,
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'visible',
    flexDirection: 'column',
    '&.btn': {
      flexDirection: 'row-reverse',
      justifyContent: 'space-around',
      padding: '16px 180px',
    },
  },
  shareButton: {
    opacity: 1,
    '&:hover': {
      color: `${theme.palette.secondary.main} !important`,
    },
  },
}));
const Share = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dataStore = useDataStore();
  const location = useLocation();
  if (!dataStore.ready) {
    return null;
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {/* <Grow in={whoDataStore.ready}> */}
        <Paper
          className={classes.paper}
          style={{
            height: '100px',
            maxHeight: '90vh',
            width: '100%',
            justifyContent: 'space-between',
            padding: 10,
          }}
        >
          <Title style={{ textAlign: 'center' }}>Share:</Title>
          <div style={{ display: 'flex', textAlign: 'center' }}>
            <Grid item xs={4}>
              <FacebookShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.shareButton}
              >
                <FacebookIcon size={48} round />
              </FacebookShareButton>
            </Grid>
            <Divider orientation='vertical' flexItem={true} light={true} />
            <Grid item xs={4}>
              <LinkedinShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.shareButton}
              >
                <LinkedinIcon size={48} round />
              </LinkedinShareButton>
            </Grid>
            <Divider orientation='vertical' flexItem={true} light={true} />
            <Grid item xs={4}>
              <WhatsappShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.shareButton}
              >
                <WhatsappIcon size={48} round />
              </WhatsappShareButton>
            </Grid>
          </div>
        </Paper>
        {/* </Grow> */}
      </Grid>
      <Grid item xs={12}>
        <Card style={{ width: '100%' }}>
          <ButtonBase
            className={clsx(classes.paper, 'btn')}
            style={{
              backgroundColor: theme.palette.secondary.main,
              cursor: 'pointer',
              width: '100%',
            }}
            onClick={() => {
              window.location.assign(
                `https://github.com/m3h0w/covid19-coronavirus-react-visualization`
              );
            }}
          >
            <Typography variant='h5'>Contribute</Typography>
            <GitHubIcon />
          </ButtonBase>
        </Card>
      </Grid>

      {/* Empty Grid items because I couldn't find a way to leave space at the end. Needs to be fixed */}
      <Grid item xs={12} />
      <Grid item xs={12} />
    </Grid>
  );
};

export default Share;
