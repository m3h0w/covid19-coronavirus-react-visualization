import React, { FC } from 'react';
import Title from 'components/Dashboard/Title';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  typo: { marginTop: '-17px', marginBottom: '1px' },
}));

interface IProps {
  color?: 'primary' | 'secondary' | 'initial';
  title: string;
  number: string | number;
  version?: 'large';
  centered?: boolean;
}

const NumberWithTitle: FC<IProps> = ({
  color = 'primary',
  title,
  number,
  version,
  centered = false,
}) => {
  const classes = useStyles();
  if (version === 'large') {
    return (
      <>
        <Title style={centered ? { textAlign: 'center' } : {}} color={'initial'}>
          {title}
        </Title>
        <Typography
          style={centered ? { textAlign: 'center' } : {}}
          color={color}
          component='p'
          variant='h2'
          className={classes.typo}
        >
          {number}
        </Typography>
      </>
    );
  }

  return (
    <>
      <Title color={'initial'}>{title}</Title>
      <Typography color={color} component='p' variant='h4' className={classes.typo}>
        {number}
      </Typography>
    </>
  );
};

export default NumberWithTitle;
