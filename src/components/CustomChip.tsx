import React from 'react';
import { Chip } from '@material-ui/core';
import { getContrastYIQ } from '../utils/colors';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    chip: {
      margin: 5,
      backgroundColor: (props: { backgroundColor: string }) => props.backgroundColor,
      color: (props: { backgroundColor: string }) =>
        props.backgroundColor ? getContrastYIQ(props.backgroundColor) : 'inherit',
      '& *': {
        color: (props: { backgroundColor: string }) =>
          props.backgroundColor ? getContrastYIQ(props.backgroundColor) : 'inherit',
      },
    },
  })
);

const CustomChip = (props) => {
  const { handleDelete, label, backgroundColor } = props;
  const classes = useStyles({ backgroundColor });
  return (
    <Chip
      onClick={props.onClick}
      style={props.style}
      label={label}
      onDelete={handleDelete}
      className={classes.chip}
    />
  );
};

export default CustomChip;
