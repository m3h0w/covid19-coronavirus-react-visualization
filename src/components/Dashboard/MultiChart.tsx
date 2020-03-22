import React, { useEffect, useState, FC, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  TickFormatterFunction,
  CartesianGrid,
  Dot,
} from 'recharts';
import Title from './Title';

import moment, { Moment } from 'moment';
import { FaBrush } from 'react-icons/fa';
import getBrush from './Brush';
import Colors from '../../utils/colors';
import { Button } from '@material-ui/core';
import useDataStore from '../../data/dataStore';
import { observer } from 'mobx-react-lite';
import { momentToFormat } from '../../utils/getDatesFromDataRow';
import getYAxis from './YAxis';
import getTooltip from './Tooltip';

export type Row = {
  [key in Column]: string;
};

type Column = 'Province/State' | 'Country/Region' | 'Lat' | 'Long' | string;

interface IProps {
  title: string;
  yLabel: string;
  countries: string[];
  colors: { [country: string]: string };
  generateNewColors: () => void;
  syncId: string;
  dataType: 'confirmed' | 'dead';
}

const MultiChart: FC<IProps> = observer(
  ({ title, yLabel, countries, dataType, colors, syncId }) => {
    const theme = useTheme();
    const dataStore = useDataStore();
    const data = dataStore.dataForAfter100Cases(dataType, countries);
    console.log({ data });

    const getFormattedLine = (dot: boolean = false) => {
      const CustomizedDot = (props) => {
        const { cx, cy, stroke, payload, value, lastX } = props;

        if (payload.time === lastX) {
          return (
            <svg x={cx - 5} y={cy - 5} width={50} height={50} fill={stroke} viewBox='0 0 1024 1024'>
              <path
                d='
                 M 100, 100
                 m -75, 0
                 a 75,75 0 1,0 150,0
                 a 75,75 0 1,0 -150,0
                 '
              />
            </svg>
          );
        }

        return <div></div>;
      };

      if (!data) {
        return null;
      }

      return countries.map((country: string, i: number) => {
        const values = Object.values(data.map((el) => el[country])).filter((v) => v !== undefined);
        const maxValue = Math.max(...values);
        const maxIndices = values.reduce(
          (acc, curr, idx) => (curr === maxValue ? [...acc, idx] : acc),
          []
        );
        return (
          <Line
            key={i}
            type='monotone'
            dataKey={country}
            name={country}
            stroke={colors[country]}
            dot={<CustomizedDot lastX={Math.max(...maxIndices)} />}
            strokeWidth={1.5}
            opacity={0.8}
          />
        );
      });
    };

    const brush = getBrush({
      data: data,
      color: theme.palette.text.secondary,
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
          <Title>{title}</Title>
        </div>
        <ResponsiveContainer width={'100%'}>
          <LineChart
            data={data}
            margin={{
              top: 16,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            syncId={syncId}
          >
            <CartesianGrid strokeDasharray='1 6' />
            <XAxis
              // angle={-15}
              dataKey='time'
              stroke={theme.palette.text.secondary}
              // tickFormatter={formatXAxis}
              domain={['auto', 'auto']}
              label={{
                fontSize: 10,
                value: 'Days after a 100th case',
                position: 'insideTopRight',
                dy: -20,
              }}
              // height={30}
              type={'number'}
            />
            {getYAxis(yLabel)}
            {getFormattedLine(true)}
            {brush}
            {getTooltip()}
          </LineChart>
        </ResponsiveContainer>
      </>
    );
  }
);

const TIME_FORMAT = 'MMM Do';
const formatXAxis: TickFormatterFunction = (tickItem: number) =>
  moment(tickItem * 1000).format(TIME_FORMAT);

export default MultiChart;
