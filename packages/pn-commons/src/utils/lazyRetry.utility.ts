import { ComponentType, LazyExoticComponent, lazy } from 'react';

export const lazyRetry = <T extends ComponentType<React.PropsWithChildren<any>>>(
  componentImport: () => Promise<{ default: T }>
): LazyExoticComponent<T> =>
  lazy((async () => {
    // check if the window has already been refreshed
    const hasRefreshed = JSON.parse(sessionStorage.getItem('retry-lazy-refreshed') ?? 'false');
    // try to import the component
    try {
      const component = await componentImport();
      sessionStorage.removeItem('retry-lazy-refreshed'); // success so remove the refresh
      return component;
    } catch (error) {
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
