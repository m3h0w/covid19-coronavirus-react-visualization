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
import { Hidden } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;
const toolbarHeight = 48;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
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
    marginRight: 15,
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
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
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
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f6f6f6',
  },
  container: {
    paddingTop: (props) => (props.paddingTop ? theme.spacing(4) : 0),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    // padding: theme.spacing(2),
    display: 'flex',
    overflow: 'visible',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 400,
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
          <Hidden xsDown implementation='css'>
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
        {/* <Divider />
        <List>{secondaryListItems}</List> */}
      </Drawer>
      <main className={classes.content}>
        {grid ? (
          <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth='xl' className={classes.container}>
              <Grid container spacing={3}>
                {children}
              </Grid>
              {/* <Box pt={4}>
            <Copyright />
          </Box> */}
            </Container>
          </>
        ) : (
          <>
            <div className={classes.appBarSpacer} />
            {children}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
