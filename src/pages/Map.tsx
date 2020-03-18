import React, { useState, useEffect, useCallback } from 'react';
import MapChart from 'components/MapChart';
import Dashboard from 'components/Dashboard/Dashboard';
import useDataStore from '../data/dataStore';
import { observer } from 'mobx-react-lite';
import IOSSlider from '../components/IOSSlider';
import ReactTooltip from 'react-tooltip';
import createPersistedState from '../utils/memoryState';
import { showInfoSnackBar } from '../components/Snackbar';
import { useStateAndLocalStorage } from 'persistence-hooks';
import Typography from '@material-ui/core/Typography';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import IconButton from '@material-ui/core/IconButton';
import StopIcon from '@material-ui/icons/Stop';

const getSliderValueTextFunc = (dates: string[]) => (value: number) => dates[value];

const MapPage = observer(() => {
  const dataStore = useDataStore();
  const [sliderValue, setSliderValue] = useState<number>();
  const [date, setDate] = useState<string>();
  const [tooltipContent, setTooltipContent] = useState();
  const [maxSliderValue, setMaxSliderValue] = useState();
  const [shownSnackbar, setShownSnackbar] = useStateAndLocalStorage(
    false,
    'shownMapSliderSnackbar'
  );
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const checkKey = (e) => {
      e = e || window.event;
      if (e.keyCode === '37') {
        setSliderValue((prev) => Math.max(prev - 1, 0));
      } else if (e.keyCode === '39') {
        setSliderValue((prev) => Math.min(prev + 1, maxSliderValue));
      }
    };
    document.addEventListener('onkeydown', checkKey);

    return () => document.removeEventListener('onkeydown', checkKey);
  }, [maxSliderValue]);

  useEffect(() => {
    if (dataStore && dataStore.datesConverted) {
      setMaxSliderValue(dataStore.datesConverted.length - 1);
      setSliderValue(dataStore.datesConverted.length - 1);
    }
  }, [dataStore, dataStore.datesConverted]);

  useEffect(() => {
    if (sliderValue && dataStore && dataStore.datesConverted) {
      setDate(dataStore.datesConverted[sliderValue]);
    }
  }, [sliderValue, dataStore, dataStore.datesConverted]);

  useEffect(() => {
    if (playing) {
      if (sliderValue === maxSliderValue) {
        setPlaying(false);
      } else {
        setTimeout(() => {
          setSliderValue((prev) => Math.min(prev + 1, maxSliderValue));
        }, 500);
      }
    }
  }, [playing, sliderValue, maxSliderValue]);

  useEffect(() => {
    if (!shownSnackbar && dataStore.ready) {
      showInfoSnackBar('Use the slider on the bottom to travel in time 🦋', 4000);
      setShownSnackbar(true);
    }
  }, [shownSnackbar, setShownSnackbar, dataStore.ready]);

  return (
    <Dashboard title='Map (confirmed cases)' grid={false}>
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
        {dataStore.datesConverted?.length ? (
          <div>
            <MapChart date={date} setTooltipContent={setTooltipContent} />
            <ReactTooltip>{tooltipContent}</ReactTooltip>
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: 'relative',
          bottom: '20px',
          width: '80%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {sliderValue !== undefined && dataStore?.datesConverted?.length && date ? (
          <>
            <Typography style={{ marginTop: '-1px' }}>Play</Typography>
            <IconButton
              onClick={() => {
                if (playing) {
                  setSliderValue(maxSliderValue);
                } else {
                  setSliderValue(0);
                }
                setPlaying(!playing);
              }}
            >
              {!playing ? <PlayCircleFilledIcon /> : <StopIcon />}
            </IconButton>
            <IOSSlider
              valueLabelFormat={getSliderValueTextFunc(dataStore.datesConverted)}
              getAriaValueText={getSliderValueTextFunc(dataStore.datesConverted)}
              aria-labelledby='dates-map-slider'
              valueLabelDisplay='auto'
              onChange={(event: any, newValue: number | number[]) => {
                setSliderValue(newValue as number);
              }}
              value={sliderValue}
              step={1}
              marks
              min={0}
              max={maxSliderValue}
            />
          </>
        ) : null}
      </div>
    </Dashboard>
  );
});

export default MapPage;
