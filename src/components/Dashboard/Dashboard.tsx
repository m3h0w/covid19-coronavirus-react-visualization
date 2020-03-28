import React, { useState, useEffect, FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems, MainListItems } from './ListItems';
import Chart from './Chart';
import CurrentCount from './CurrentCount';
import Orders from './Orders';
import CustomSelect from './Select';
import { CustomAutocomplete } from './Select';
import { Row } from './Chart';
import useDataStore from '../../data/dataStore';
import { Hidden, Grow, Fade } from '@material-ui/core';
import backgroundSmoke from '../../assets/pinksmoke-min.jpg';
import { GLOBAL_PAPER_OPACITY, animationTime } from '../../utils/consts';
import logo from '../../assets/logo_square_white_transparent.png';

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

    '& *': {
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
    width: theme.spacing(7),
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
    backgroundImage: `url(${backgroundSmoke})`,
    backgroundSize: 'cover',
  },
  container: {
    paddingTop: (props) => (props.paddingTop ? theme.spacing(2) : 0),
    paddingBottom: theme.spacing(4),
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
}));

interface IProps {
  title: string;
  icon: FC;
  grid?: boolean;
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

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

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
                marginRight: '3px',
              }}
            >
              <img src={logo} height={40} style={{ marginRight: 1 }} />
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
          {/* <IconButton color='inherit'>
            <Badge badgeContent={4} color='secondary'>
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
          <Hidden xsDown mdUp implementation='css'>
            {dataStore.ready && (
              <Typography style={{ fontSize: '0.5rem' }}>
                Last updated: {dataStore.dates[dataStore.dates.length - 1].format('MMMM Do')}
              </Typography>
            )}
          </Hidden>
          <Hidden smDown implementation='css'>
            {dataStore.ready && (
              <Typography>
                Last updated: {dataStore.dates[dataStore.dates.length - 1].format('MMMM Do')}
              </Typography>
            )}
          </Hidden>
        </Toolbar>
      </AppBar>
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
      <Fade in={dataStore.ready}>
        <main className={classes.content}>
          {grid ? (
            <>
              <div className={classes.appBarSpacer} />
              <Container maxWidth='xl' className={classes.container}>
                <Grid container spacing={3}>
                  {children}
                </Grid>
              </Container>
            </>
          ) : (
            <>
              <div className={classes.appBarSpacer} />
              {children}
            </>
          )}
        </main>
      </Fade>
    </div>
  );
};

export default Dashboard;
