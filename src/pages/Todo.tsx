import React from 'react';
import Dashboard from 'components/Dashboard/Dashboard';

const todos = [
  'Add info button next to Infection Trajectories and redirect to an FAQ (knowledge base with static text)',
  'Per capita switch for map and charts (global?)',
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
