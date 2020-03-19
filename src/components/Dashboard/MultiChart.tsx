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
import useDataStore from '../../data/dataStore';
import { observer } from 'mobx-react-lite';
import { momentToFormat } from '../../utils/getDatesFromDataRow';
import getYAxis from './YAxis';

export type Row = {
  [key in Column]: string;
};

type Column = 'Province/State' | 'Country/Region' | 'Lat' | 'Long' | string;

interface IProps {
  title: string;
  yLabel: string;
  countries: string[];
  dataByCountry: { [key: string]: { confirmed: Row; dead: Row } };
  dates: Moment[];
  colors: { [country: string]: string };
  generateNewColors: () => void;
  syncId: string;
  dataType: 'confirmed' | 'dead';
}

const MultiChart: FC<IProps> = observer(
  ({ title, yLabel, countries, dataType, colors, syncId }) => {
    const theme = useTheme();
    const dataStore = useDataStore();
    const confirmedCasesData = dataStore.dataForAfter100Cases(dataType, countries);

    const getFormattedLine = (dot: boolean = false) => {
      if (!confirmedCasesData) {
        return null;
      }

      return countries.map((country: string, i: number) => {
        return (
          <Line
            key={i}
            type='monotone'
            dataKey={country}
            name={country}
            stroke={colors[country]}
            dot={false}
            strokeWidth={1.5}
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

    console.log(dataStore.dataForAfter100Cases(dataType, countries));

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
            data={confirmedCasesData}
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
              label={{ value: 'Days after a 100th case', position: 'insideTopRight', dy: -20 }}
              // height={30}
              type={'number'}
            />
            {getYAxis(yLabel)}
            {getFormattedLine(true)}
            <Line
              type='monotone'
              dataKey='deaths'
              stroke={theme.palette.secondary.main}
              dot={true}
            />
            {brush}
            <Tooltip
              offset={-120}
              // labelFormatter={formatXAxis}
              allowEscapeViewBox={{ x: true, y: true }}
            />
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
