import React from 'react';
import NumberWithTitle from '../NumberWithTitle';
import numberWithCommas from '../../utils/numberWithCommas';

export default function CurrentCount({ style, confirmedCases, deaths, mortalityRate }) {
  return (
    <div style={style}>
      <NumberWithTitle
        color={'primary'}
        title={'Confirmed cases'}
        number={numberWithCommas(confirmedCases)}
      />
      <NumberWithTitle color={'initial'} title={'Deaths'} number={numberWithCommas(deaths)} />
      {mortalityRate ? (
        <NumberWithTitle
          color={'secondary'}
          title={'Case fatality rate'}
          number={`${(mortalityRate * 100).toFixed(2)}%`}
        />
      ) : (
        undefined
      )}
    </div>
  );
}
