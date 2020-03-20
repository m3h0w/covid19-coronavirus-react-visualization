import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import theme from 'theme';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function CurrentCount({ confirmedCases, deaths, mortalityRate }) {
  const classes = useStyles();
  const typoStyle = { marginTop: '-13px', marginBottom: '5px' };
  return (
    <React.Fragment>
      <Title color={'initial'}>Confirmed cases</Title>
      <Typography color={'primary'} component='p' variant='h4' style={typoStyle}>
        {confirmedCases}
      </Typography>
      <Title color={'initial'}>Deaths</Title>
      <Typography color={'secondary'} component='p' variant='h4' style={typoStyle}>
        {deaths}
      </Typography>
      {mortalityRate && (
        <>
          <Title color={'initial'}>Mortality rate</Title>
          <Typography color={'textPrimary'} component='p' variant='h4' style={typoStyle}>
            {(mortalityRate * 100).toFixed(2)}%
          </Typography>
        </>
      )}
      {/* <Typography color='textSecondary' className={classes.depositContext}>
        on 15 March, 2019
      </Typography>
      <div>
        <Link color='primary' href='#' onClick={preventDefault}>
          View balance
        </Link>
      </div> */}
    </React.Fragment>
  );
}
