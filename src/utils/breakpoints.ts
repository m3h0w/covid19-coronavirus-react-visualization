const ResponsiveBreakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

const getWindowWidth = () => window.innerWidth;

export const smUp = () => getWindowWidth() >= ResponsiveBreakpoints.sm;

export const mdUp = () => getWindowWidth() >= ResponsiveBreakpoints.md;

export const smDown = () => getWindowWidth() <= ResponsiveBreakpoints.md;

export const xsDown = () => getWindowWidth() <= ResponsiveBreakpoints.sm;
