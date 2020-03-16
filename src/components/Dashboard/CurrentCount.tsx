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

export default function CurrentCount({ confirmedCases, deaths }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title color={'initial'}>Confirmed cases</Title>
      <Typography color={'primary'} component='p' variant='h4'>
        {confirmedCases}
      </Typography>
      <Title color={'initial'}>Deaths</Title>
      <Typography color={'secondary'} component='p' variant='h4'>
        {deaths}
      </Typography>
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
