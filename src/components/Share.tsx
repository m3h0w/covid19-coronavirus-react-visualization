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
import { GLOBAL_PAPER_OPACITY } from '../utils/consts';
import { FacebookShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share';
import { useLocation } from 'react-router-dom';
import FacebookIcon from '@material-ui/icons/Facebook';
import WhatsappIcon from '@material-ui/icons/WhatsApp';
import LinkedinIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import ButtonBase from '@material-ui/core/ButtonBase';

const useStyles = makeStyles((theme) => ({
  paper: {
    opacity: `${GLOBAL_PAPER_OPACITY} !important`,
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'visible',
    flexDirection: 'column',
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
            marginBottom: 10,
            justifyContent: 'space-between',
            padding: 10,
          }}
        >
          <Title style={{ textAlign: 'center' }}>SHARE</Title>
          <div style={{ display: 'flex', textAlign: 'center' }}>
            <Grid item xs={4}>
              <FacebookShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.shareButton}
              >
                <FacebookIcon fontSize='large' />
              </FacebookShareButton>
            </Grid>
            <Grid item xs={4}>
              <LinkedinShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.shareButton}
              >
                <LinkedinIcon fontSize='large' />
              </LinkedinShareButton>
            </Grid>
            <Grid item xs={4}>
              <WhatsappShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.shareButton}
              >
                <WhatsappIcon fontSize='large' />
              </WhatsappShareButton>
            </Grid>
          </div>
        </Paper>
        {/* </Grow> */}
      </Grid>
      <Grid item xs={12}>
        <Card style={{ width: '100%' }}>
          <ButtonBase
            className={classes.paper}
            style={{
              backgroundColor: theme.palette.secondary.main,
              cursor: 'pointer',
              width: '100%',
              // maxHeight: '90vh',
              // display: 'flex',
              // justifyContent: 'space-evenly',
              // padding: '0px 25%',
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
