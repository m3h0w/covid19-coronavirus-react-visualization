import React from 'react';
import Grid from '@material-ui/core/Grid';
import Title from 'components/Dashboard/Title';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grow from '@material-ui/core/Grow';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import useDataStore from '../data/dataStore';
import useWhoDataStore from '../data/whoDataStore';
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
  const whoDataStore = useWhoDataStore();
  const location = useLocation();
  if (!dataStore.ready) {
    return null;
  }
  return (
    <Grid item xs={12}>
      {/* <Grow in={whoDataStore.ready}> */}
        <Paper
          className={classes.paper}
          style={{
            height: '200px',
            maxHeight: '90vh',
            width: '100%',
            marginBottom: 50,
            justifyContent: 'space-between',
          }}
        >
          <Title style={{ textAlign: 'center' }}>SHARE</Title>
          <div style={{ display: 'flex', textAlign: 'center' }}>
            <Grid item xs={4}>
              <FacebookShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.shareButton}
              >
                <FacebookIcon />
              </FacebookShareButton>
            </Grid>
            <Grid item xs={4}>
              <LinkedinShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.shareButton}
              >
                <LinkedinIcon />
              </LinkedinShareButton>
            </Grid>
            <Grid item xs={4}>
              <WhatsappShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.shareButton}
              >
                <WhatsappIcon />
              </WhatsappShareButton>
            </Grid>
          </div>
          <div style={{ margin: '2vh' }}>
            <Grid item xs={12}>
              <ButtonBase
                className={classes.paper}
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
            </Grid>
          </div>
        </Paper>
      {/* </Grow> */}
    </Grid>
  );
};

export default Share;
