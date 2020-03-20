const last = <T>(array: T[] | undefined): T | undefined => {
  if (!array || !array.length) {
    return;
  }
  return array[array.length - 1];
};

export default last;
