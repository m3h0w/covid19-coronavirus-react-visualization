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

interface ICustomListItemProps {
  to: string;
  text: string;
  Icon: (SvgIconProps) => JSX.Element;
}

const CustomListItem: FC<ICustomListItemProps> = ({ to, text, Icon }) => {
  const location = useLocation();
  const theme = useTheme();

  return (
    <ListItem
      style={{
        textDecoration: location.pathname.split('/')[1] === to ? 'underline' : 'initial',
        textDecorationColor: theme.palette.secondary.main,
      }}
      selected={location.pathname.split('/')[1] === to}
      button
      component={RouterLink}
      to={to}
    >
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
};

export const MainListItems = () => {
  return (
    <div>
      <CustomListItem to='dashboard' text='Dashboard' Icon={DashboardIcon} />
      <CustomListItem to='comparison' text='Comparison' Icon={BarChartIcon} />
      <CustomListItem to='map' text='Map' Icon={MapIcon} />
      <CustomListItem to='todo' text='Todo' Icon={ShoppingCartIcon} />

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
    </div>
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
