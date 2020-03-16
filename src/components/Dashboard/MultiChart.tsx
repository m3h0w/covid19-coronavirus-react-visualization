import React, { useEffect, useState, FC, useCallback } from 'react';
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
} from 'recharts';
import Title from './Title';

import moment, { Moment } from 'moment';
import { FaBrush } from 'react-icons/fa';
import getBrush from './Brush';
import Colors from '../../utils/colors';
import { Button } from '@material-ui/core';
// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

export type Row = {
  [key in Column]: string;
};

const firstDate = '1/22/20';

type Column = 'Province/State' | 'Country/Region' | 'Lat' | 'Long' | string;

const momentToFormat = (m: Moment): string => m.format('M/DD/YY');

const momentFunc = (data: Row | undefined) => {
  if (!data) {
    return;
  }
  const firstDateM = moment(firstDate);
  const nowM = moment();
  const days = nowM.diff(firstDateM, 'days');
  const dates: Moment[] = [];
  for (let i = 0; i < days + 1; i = i + 1) {
    const newDate = moment(firstDate).add(i, 'days');
    if (momentToFormat(newDate) in data) {
      dates.push(newDate);
    }
  }
  return dates;
};

interface IProps {
  countries: string[];
  dataByCountry: { [key: string]: { confirmed: Row; dead: Row } };
}

const MultiChart: FC<IProps> = ({ countries, dataByCountry }) => {
  const theme = useTheme();
  const [firstCaseDate, setFirstCaseDate] = useState();
  const [confirmedCasesData, setConfirmedCasesData] = useState();
  const colorsHelper = new Colors();
  const [colors, setColors] = useState();

  useEffect(() => {
    console.log({ dataByCountry });
    console.log({ countries });
    if (dataByCountry && countries && countries.length) {
      const dates = momentFunc(dataByCountry[countries[0]].confirmed);
      let lastZeroDay: Moment | undefined;
      const d = dates.map((date) => {
        let toReturn: { [key: string]: number } = {
          time: date.unix(),
        };
        countries.forEach((country: string) => {
          if (dataByCountry[country].confirmed) {
            const confirmedCases = Number(dataByCountry[country].confirmed[momentToFormat(date)]);
            toReturn[`confirmedCases${country}`] = confirmedCases;
          }
        });
        return toReturn;
      });
      // .filter((el) => {
      //   return moment(el.time * 1000).isAfter(lastZeroDay);
      // });
      setConfirmedCasesData(d);
      setFirstCaseDate(lastZeroDay);
    }
  }, [countries, dataByCountry]);

  const newColors = useCallback(
    () =>
      setColors(
        countries.map(() => {
          return colorsHelper.getRandomColor();
        })
      ),
    [setColors, countries]
  );

  useEffect(() => {
    newColors();
  }, [countries, newColors]);

  const getFormattedLine = (dot: boolean = false) => {
    if (!confirmedCasesData) {
      return null;
    }

    return countries.map((country: string, i: number) => {
      return (
        <Line
          key={i}
          type='monotone'
          dataKey={`confirmedCases${country}`}
          name={country}
          stroke={colors[i]}
          dot={false}
          strokeWidth={2}
        />
      );
    });
  };

  const brush = getBrush({
    data: confirmedCasesData,
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

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItem: 'end',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '10px',
        }}
      >
        <Title>Today</Title>
        <Button
          style={{ marginLeft: 15 }}
          variant='outlined'
          color='primary'
          size={'small'}
          onClick={() => {
            newColors();
          }}
        >
          New colors
        </Button>
      </div>
      <ResponsiveContainer width={'100%'}>
        <LineChart
          data={confirmedCasesData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray='1 3' />
          <XAxis
            angle={-15}
            dataKey='time'
            stroke={theme.palette.text.secondary}
            tickFormatter={formatXAxis}
          />
          <YAxis stroke={theme.palette.text.secondary} domain={[0, 'auto']}>
            <Label
              angle={270}
              position='left'
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Cases
            </Label>
          </YAxis>
          {getFormattedLine(true)}
          <Line type='monotone' dataKey='deaths' stroke={theme.palette.secondary.main} dot={true} />
          {brush}
          <Tooltip
            offset={-120}
            labelFormatter={formatXAxis}
            allowEscapeViewBox={{ x: true, y: true }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

const TIME_FORMAT = 'MMM Do';
const formatXAxis: TickFormatterFunction = (tickItem: number) =>
  moment(tickItem * 1000).format(TIME_FORMAT);

export default MultiChart;
