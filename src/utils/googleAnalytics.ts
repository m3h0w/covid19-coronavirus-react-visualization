import ReactGA from 'react-ga';

class GoogleAnalytics {
  constructor() {
    this.init();
  }

  private init = () => {
    ReactGA.initialize('UA-129359323-2');
  };

  public pageView = () => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    // console.log(`Page view ${window.location.pathname + window.location.search}`);
  };

  public setUser = (userId: string) => {
    ReactGA.set({ userId });
  };
}

const googleAnalyticsInstance = new GoogleAnalytics();

export default googleAnalyticsInstance;
