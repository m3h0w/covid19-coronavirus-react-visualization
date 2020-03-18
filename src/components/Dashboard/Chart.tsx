import React, { useEffect, useState, FC } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  TickFormatterFunction,
  CartesianGrid,
  Tooltip,
  LabelProps,
} from 'recharts';
import Title from './Title';

import moment, { Moment } from 'moment';
import { FaBrush } from 'react-icons/fa';
import getBrush from './Brush';
import { momentToFormat, FIRST_DATE } from '../../utils/getDatesFromDataRow';
import { Hidden } from '@material-ui/core';
import getYAxis from './YAxis';
// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

export type Row = {
  [key in Column]: string;
};

type Column = 'Province/State' | 'Country/Region' | 'Lat' | 'Long' | string;

interface IProps {
  rowData: { confirmed: Row; dead: Row };
  dates: Moment[];
}

const Chart: FC<IProps> = ({ rowData, dates }) => {
  const theme = useTheme();
  const [firstCaseDate, setFirstCaseDate] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    if (rowData && rowData.confirmed && rowData.dead) {
      let lastZeroDay: Moment | undefined = moment(FIRST_DATE);
      const d = dates
        .map((date) => {
          const confirmedCases = Number(rowData.confirmed[momentToFormat(date)]);
          const deaths = Number(rowData.dead[momentToFormat(date)]);

          if (lastZeroDay?.isSame(moment(FIRST_DATE)) && confirmedCases > 0) {
            lastZeroDay = date.clone();
            lastZeroDay.subtract(2, 'days');
          }
          return {
            confirmedCases,
            deaths,
            time: date.unix(),
          };
        })
        .filter((el) => {
          return moment(el.time * 1000).isAfter(lastZeroDay);
        });
      setData(d);
      setFirstCaseDate(lastZeroDay);
    }
  }, [rowData]);

  const getFormattedLine = () => (
    <Line
      type='monotone'
      dataKey='confirmedCases'
      stroke={theme.palette.primary.main}
      dot={false}
    />
  );

  const brush = getBrush({
    data,
    color: theme.palette.text.secondary,
    tickFormatter: formatXAxis,
    dataKey: 'time',
    children: (
      <LineChart>
        <YAxis hide domain={[0, 'auto']} />
        {getFormattedLine()}
      </LineChart>
    ),
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <Title>Cases & Deaths</Title>
      <ResponsiveContainer width={'100%'}>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <CartesianGrid strokeDasharray='1 3' />
          <XAxis
            angle={-15}
            dataKey='time'
            stroke={theme.palette.text.secondary}
            tickFormatter={formatXAxis}
          />
          {getYAxis('No. of cases & deaths')}
          <Line
            type='monotone'
            dataKey='confirmedCases'
            name='Confirmed cases'
            stroke={theme.palette.primary.main}
            dot={true}
          />
          <Line
            type='monotone'
            dataKey='deaths'
            name='Deaths'
            stroke={theme.palette.secondary.main}
            dot={true}
          />
          {brush}
          <Tooltip labelFormatter={formatXAxis} allowEscapeViewBox={{ x: true, y: true }} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

const TIME_FORMAT = 'MMM Do';
const formatXAxis: TickFormatterFunction = (tickItem: number) =>
  moment(tickItem * 1000).format(TIME_FORMAT);

export default Chart;
