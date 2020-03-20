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
import { SvgIconProps, withStyles } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import Link from '@material-ui/core/Link';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

const StyledListItemIcon = withStyles((theme) => ({
  root: { minWidth: '45px' },
}))(ListItemIcon);

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
  const isSelected = location.pathname.split('/')[1] === to;

  if (href) {
    LinkElement = Link;
  }

  return (
    <ListItem
      style={{
        textDecoration: isSelected ? 'underline' : 'initial',
        textDecorationColor: theme.palette.secondary.main,
        background: 'none',
        ...style,
      }}
      selected={isSelected}
      button
      component={LinkElement}
      to={to}
      href={href}
      target={href ? '_blank' : '_self'}
    >
      <StyledListItemIcon>
        <Icon
          style={{ color: isSelected ? theme.palette.secondary.main : theme.palette.grey[800] }}
        />
      </StyledListItemIcon>
      <ListItemText primary={text} />
      {AfterIcon && <AfterIcon fontSize={'small'} />}
    </ListItem>
  );
};

export const MainListItems = () => {
  return (
    <List style={{ height: '100%', padding: 0 }}>
      <CustomListItem to='map' text='Map' Icon={MapIcon} />
      <CustomListItem to='dashboard' text='Country dashboard' Icon={DashboardIcon} />
      <CustomListItem
        to='infection-trajectories'
        text='Infection trajectories'
        Icon={BarChartIcon}
      />
      <Divider />
      <CustomListItem
        href='https://github.com/m3h0w/covid19-coronavirus-react-visualization'
        text={`GitHub repository`}
        Icon={GitHubIcon}
        AfterIcon={CallMadeIcon}
        style={{ position: 'absolute', bottom: 0 }}
      />
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
