import React, { useState, FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems } from './ListItems';
import useDataStore from '../../data/dataStore';
import { Hidden, Fade, CircularProgress } from '@material-ui/core';
import backgroundSmoke from '../../assets/pinksmoke-min.jpg';
import backgroundSmokeMobile from '../../assets/pinksmoke-small-min.jpg';
import { GLOBAL_PAPER_OPACITY, SIDEBAR_WIDTH } from '../../utils/consts';
import logo from '../../assets/logo_square_white_transparent.png';
import { useLocation } from 'react-router-dom';
import BottomNavigation from 'components/BottomNavigationBar';
import { FacebookShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share';
import FacebookIcon from '@material-ui/icons/Facebook';
import WhatsappIcon from '@material-ui/icons/WhatsApp';
import LinkedinIcon from '@material-ui/icons/LinkedIn';
import useWindowWidth from '../../utils/useWindowWidth';

const drawerWidth = 240;
const toolbarHeight = 48;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    paddingLeft: 16,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 6,
      paddingRight: 6,
    },
    color: 'white',
    minHeight: toolbarHeight,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    minHeight: toolbarHeight,
    // ...theme.mixins.toolbar,
  },
  appBar: {
    background: 'linear-gradient(to right bottom, #fe217d, #fca2c0)',
    opacity: GLOBAL_PAPER_OPACITY,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 10,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    '& > *': {
      marginRight: 10,
    },
  },
  drawerPaper: {
    opacity: `${GLOBAL_PAPER_OPACITY} !important`,
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    opacity: `${GLOBAL_PAPER_OPACITY} !important`,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: SIDEBAR_WIDTH,
    // [theme.breakpoints.up('sm')]: {
    //   width: theme.spacing(7),
    // },
  },
  appBarSpacer: {
    minHeight: toolbarHeight,
    // ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey[100],
    backgroundSize: 'cover',
  },
  container: {
    paddingTop: (props) => (props.paddingTop ? theme.spacing(2) : 0),
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down('xs')]: { paddingRight: '5px', paddingLeft: '5px' },
  },
  paper: {
    opacity: `${GLOBAL_PAPER_OPACITY} !important`,
    // padding: theme.spacing(2),
    display: 'flex',
    overflow: 'visible',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 350,
    maxHeight: '80vh',
  },
  hidden: {
    display: 'none',
  },
  facebookShareButton: {
    display: 'flex',
    marginTop: '2px',
    marginRight: '10px',
    opacity: 1,
    '&:hover': {
      color: `${theme.palette.secondary.main} !important`,
    },
  },
}));

interface IProps {
  title: string;
  icon: FC;
  Icon: () => null;
  grid?: boolean;
  startOpen: boolean;
  paddingTop?: boolean;
}

const Dashboard: FC<IProps> = ({
  title,
  children,
  Icon = () => null,
  grid = true,
  startOpen = false,
  paddingTop = true,
}) => {
  const classes = useStyles({ paddingTop });
  const [open, setOpen] = useState(startOpen);
  const dataStore = useDataStore();
  const location = useLocation();
  const backgroundUrl = useWindowWidth() >= 650 ? backgroundSmoke : backgroundSmokeMobile;

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // console.log(`https://covid19.pink${location.pathname}`);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='absolute' className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.title}>
            <a
              href={'/'}
              style={{
                color: 'inherit',
                textDecoration: 'inherit',
                display: 'flex',
                alignItems: 'center',
                // marginRight: '3px',
              }}
            >
              <img src={logo} height={40} style={{ marginRight: 1 }} alt='covid19.pink logo' />
              <Hidden smDown>
                <Typography
                  className={open && classes.hidden}
                  component='h1'
                  variant='h6'
                  color='inherit'
                  noWrap
                >
                  COVID19.PINK
                </Typography>
              </Hidden>
            </a>
            <Divider
              className={open && classes.hidden}
              orientation='vertical'
              flexItem={true}
              light={true}
            />
            <Typography component='h1' variant='h6' color='inherit' noWrap>
              {title}
            </Typography>
            <Icon />
          </div>

          <Hidden xsDown implementation='css'>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <Hidden smDown implementation='css'>
                <Typography style={{ marginRight: 10 }}>Share:</Typography>
              </Hidden>
              <Hidden xsDown mdUp implementation='css'>
                <Typography style={{ marginRight: 5 }}>Share:</Typography>
              </Hidden>
              <FacebookShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.facebookShareButton}
              >
                <FacebookIcon
                  size={32}
                  round={true}
                  iconFillColor={'#fff'}
                  bgStyle={{
                    backgroundColor: '#FFF',
                  }}
                />
              </FacebookShareButton>
              <LinkedinShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.facebookShareButton}
              >
                <LinkedinIcon size={32} round={true} iconFillColor={'#fff'} />
              </LinkedinShareButton>
              <WhatsappShareButton
                url={`https://covid19.pink${location.pathname}`}
                className={classes.facebookShareButton}
              >
                <WhatsappIcon
                  size={32}
                  round={true}
                  iconFillColor={'#fff'}
                  bgStyle={{
                    backgroundColor: '#FFF',
                  }}
                />
              </WhatsappShareButton>
              <Divider
                orientation='vertical'
                flexItem={true}
                light={true}
                style={{ marginRight: '10px' }}
              />
            </div>
          </Hidden>
          <Hidden xsDown mdUp implementation='css'>
            {dataStore.ready && (
              <Typography style={{ fontSize: '0.5rem' }}>
                Last updated:{' '}
                {dataStore.dates[dataStore.dates.length - 1]
                  .clone()
                  .add(1, 'day')
                  .format('MMMM Do')}
              </Typography>
            )}
          </Hidden>
          <Hidden smDown implementation='css'>
            {dataStore.ready && (
              <Typography>
                Last updated:{' '}
                {dataStore.dates[dataStore.dates.length - 1]
                  .clone()
                  .add(1, 'day')
                  .format('MMMM Do')}
              </Typography>
            )}
          </Hidden>
        </Toolbar>
      </AppBar>
      <Hidden xsDown>
        <Drawer
          variant='permanent'
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <MainListItems />
        </Drawer>
      </Hidden>
      <main className={classes.content} style={{ backgroundImage: `url(${backgroundUrl})` }}>
        {!dataStore.ready && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </div>
        )}
        {grid
          ? dataStore.ready && (
              <>
                <div className={classes.appBarSpacer} />
                <Fade in={dataStore.ready}>
                  <Container maxWidth='xl' className={classes.container}>
                    <Grid container spacing={3}>
                      {children}
                      <Hidden smUp>
                        <Grid item xs={12}>
                          <BottomNavigation />
                        </Grid>
                      </Hidden>
                    </Grid>
                  </Container>
                </Fade>
              </>
            )
          : dataStore.ready && (
              <>
                <div className={classes.appBarSpacer} />
                <Fade in={dataStore.ready}>{children}</Fade>
              </>
            )}
      </main>
    </div>
  );
};

export default Dashboard;
