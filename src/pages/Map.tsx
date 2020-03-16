import React from 'react';
import MapChart from 'components/MapChart';
import Dashboard from 'components/Dashboard/Dashboard';

const MapPage = () => (
  <Dashboard title='Map' grid={false}>
    <div
      style={{
        width: '100%',
        height: '120%',
        maxHeight: '105vh',
        overflow: 'hidden',
        padding: '30px',
        marginTop: '-150px',
      }}
    >
      <MapChart />
    </div>
  </Dashboard>
);

export default MapPage;
