import { useState, useEffect } from 'react';

const createPersistedState = () => {
  let savedValue: any;
  function useMemoryState(initialState?: any) {
    const [value, setValue] = useState(savedValue ?? initialState);

    useEffect(() => {
      savedValue = value;
    }, [value]);

    return [value, setValue];
  }
  return useMemoryState;
};

export default createPersistedState;
