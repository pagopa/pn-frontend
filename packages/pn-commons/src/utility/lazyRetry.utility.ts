import { ComponentType, LazyExoticComponent, lazy } from 'react';

export const lazyRetry = <T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): LazyExoticComponent<T> =>
  lazy((async () => {
    // check if the window has already been refreshed
    const hasRefreshed = JSON.parse(sessionStorage.getItem('retry-lazy-refreshed') ?? 'false');
    // try to import the component
    try {
      console.log('----------- lazyRetry - 1');
      const component = await componentImport();
      console.log('----------- lazyRetry - 2');
      sessionStorage.removeItem('retry-lazy-refreshed'); // success so remove the refresh
      console.log('----------- lazyRetry - 3');
      return component;
    } catch (error) {
      console.log('----------- lazyRetry - 4');
      console.log(error);
      console.log(hasRefreshed);
      if (!hasRefreshed) {
        // not been refreshed yet
        sessionStorage.setItem('retry-lazy-refreshed', 'true'); // we are now going to refresh
        window.location.reload(); // refresh the page
        return { default: () => null };
      }
      sessionStorage.removeItem('retry-lazy-refreshed'); // error after retry, so remove the refresh
      if (process.env.NODE_ENV === 'test') {
        return { default: () => 'Loading failed' };
      }
      throw error;
    }
  }) as () => Promise<{ default: T }>);
