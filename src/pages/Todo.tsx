import React from 'react';
import Dashboard from 'components/Dashboard/Dashboard';

const todos = [
  'Option to align graphs in Comparison',
  'Display data on the map ✔',
  'Time travel on the map ✔',
  'Gapminder-like plot with time travel',
  'Radar chart (Uber react-vis) per country',
  'ML for predicting cases and deaths per country',
];

const Todo = () => (
  <Dashboard title='To do'>
    <ul>
      {todos.map((todo: string) => {
        return <li>{todo}</li>;
      })}
    </ul>
  </Dashboard>
);

export default Todo;
