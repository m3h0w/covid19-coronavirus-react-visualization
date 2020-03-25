import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import theme from 'theme';
import NumberWithTitle from '../NumberWithTitle';

export default function CurrentCount({ confirmedCases, deaths, mortalityRate }) {
  return (
    <React.Fragment>
      <NumberWithTitle color={'primary'} title={'Confirmed cases'} number={confirmedCases} />
      <NumberWithTitle color={'initial'} title={'Deaths'} number={deaths} />
      {mortalityRate ? (
        <NumberWithTitle
          color={'secondary'}
          title={'Case fatality rate'}
          number={`${(mortalityRate * 100).toFixed(2)}%`}
        />
      ) : (
        undefined
      )}
    </React.Fragment>
  );
}
