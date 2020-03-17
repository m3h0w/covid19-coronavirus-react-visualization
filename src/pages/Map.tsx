import React, { useState, useEffect } from 'react';
import MapChart from 'components/MapChart';
import Dashboard from 'components/Dashboard/Dashboard';
import useDataStore from '../data/dataStore';
import { observer } from 'mobx-react-lite';
import IOSSlider from '../components/IOSSlider';
import ReactTooltip from 'react-tooltip';

const getSliderValueTextFunc = (dates: string[]) => (value: number) => dates[value];

const MapPage = observer(() => {
  const dataStore = useDataStore();
  const [sliderValue, setSliderValue] = useState<number>();
  const [didSetSliderValue, setDidSetSliderValue] = useState(false);
  const [date, setDate] = useState<string>();
  const handleChange = (event: any, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };
  const [tooltipContent, setTooltipContent] = useState();

  if (!didSetSliderValue && dataStore.dates?.length) {
    setSliderValue(dataStore.dates.length - 1);
    setDidSetSliderValue(true);
  }

  useEffect(() => {
    if (sliderValue && dataStore && dataStore.datesConverted) {
      setDate(dataStore.datesConverted[sliderValue]);
    }
  }, [sliderValue, dataStore.datesConverted]);

  return (
    <Dashboard title='Map' grid={false}>
      <div
        style={{
          width: '100%',
          margin: '0 auto',
          height: '80%',
          // maxHeight: '105vh',
          // overflow: 'auto',
          // padding: '30px',
          // marginTop: '-130px',
        }}
      >
        {dataStore.datesConverted?.length && (
          <div>
            <MapChart date={date} setTooltipContent={setTooltipContent} />
            <ReactTooltip>{tooltipContent}</ReactTooltip>
          </div>
        )}
      </div>
      <div style={{ width: '80%', margin: '0 auto' }}>
        {didSetSliderValue && dataStore?.datesConverted?.length && (
          <IOSSlider
            valueLabelFormat={getSliderValueTextFunc(dataStore.datesConverted)}
            getAriaValueText={getSliderValueTextFunc(dataStore.datesConverted)}
            aria-labelledby='dates-map-slider'
            valueLabelDisplay='auto'
            onChange={handleChange}
            value={sliderValue}
            step={1}
            marks
            min={0}
            max={dataStore.datesConverted.length - 1}
          />
        )}
      </div>
    </Dashboard>
  );
});

export default MapPage;
