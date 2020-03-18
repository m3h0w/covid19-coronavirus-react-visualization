import React, { FC } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MapIcon from '@material-ui/icons/Map';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link as RouterLink, LinkProps as RouterLinkProps, useLocation } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { SvgIconProps } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import Link from '@material-ui/core/Link';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';

interface ICustomListItemProps {
  to?: string;
  href?: string;
  text: string;
  Icon: (SvgIconProps) => JSX.Element;
  AfterIcon?: (SvgIconProps) => JSX.Element;
  style?: CSSProperties;
}

const CustomListItem: FC<ICustomListItemProps> = ({ to, href, text, Icon, AfterIcon, style }) => {
  const location = useLocation();
  const theme = useTheme();
  let LinkElement = RouterLink;

  if (href) {
    LinkElement = Link;
  }

  return (
    <ListItem
      style={{
        textDecoration: location.pathname.split('/')[1] === to ? 'underline' : 'initial',
        textDecorationColor: theme.palette.secondary.main,
        ...style,
      }}
      selected={location.pathname.split('/')[1] === to}
      button
      component={LinkElement}
      to={to}
      href={href}
      target={href ? '_blank' : '_self'}
    >
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} />
      {AfterIcon && <AfterIcon fontSize={'small'} />}
    </ListItem>
  );
};

export const MainListItems = () => {
  return (
    <List style={{ height: '100%' }}>
      <CustomListItem to='map' text='Map' Icon={MapIcon} />
      <CustomListItem to='dashboard' text='Country dashboard' Icon={DashboardIcon} />
      <CustomListItem to='comparison' text='Comparison' Icon={BarChartIcon} />
      <CustomListItem
        href='https://github.com/m3h0w/covid19-coronavirus-react-visualization'
        text={`GitHub repository`}
        Icon={GitHubIcon}
        AfterIcon={CallMadeIcon}
        style={{ position: 'absolute', bottom: 0 }}
      />
      {/* <CustomListItem to='todo' text='Todo' Icon={ShoppingCartIcon} /> */}

      {/* <ListItem button>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItem> */}
    </List>
  );
};

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary='Current month' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary='Last quarter' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary='Year-end sale' />
    </ListItem>
  </div>
);
