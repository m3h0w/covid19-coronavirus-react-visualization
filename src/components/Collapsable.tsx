import React, { FC, useState } from 'react';
import { Collapse } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  maxHeight: { maxHeight: '40vh', overflow: 'auto' },
}));

const Collapsable: FC = ({ children }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Collapse in={expanded} timeout='auto' unmountOnExit className={classes.maxHeight}>
        {children}
      </Collapse>
      <Divider />
      <IconButton
        onClick={() => {
          setExpanded(!expanded);
        }}
        style={{ width: '100%', textAlign: 'center', borderRadius: '3px' }}
      >
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    </>
  );
};

export default Collapsable;
