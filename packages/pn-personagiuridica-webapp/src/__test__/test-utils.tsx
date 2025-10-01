import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { EnhancedStore, Store, configureStore } from '@reduxjs/toolkit';
import { RenderOptions, render } from '@testing-library/react';

import { RootState, appReducers } from '../redux/store';

let testStore: EnhancedStore<RootState>;
type NavigationRouter = 'default' | 'none';

const AllTheProviders = ({
  children,
  testStore,
  navigationRouter,
}: {
  children: ReactNode;
  testStore: Store;
  navigationRouter: NavigationRouter;
}) => {
  if (navigationRouter === 'default') {
    return (
      <BrowserRouter>
        <Provider store={testStore}>{children}</Provider>
      </BrowserRouter>
    );
  }
  return <Provider store={testStore}>{children}</Provider>;
};

const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: appReducers,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

const customRender = (
  ui: ReactElement,
  {
    preloadedState,
    renderOptions,
    navigationRouter = 'default',
  }: {
    preloadedState?: any;
    renderOptions?: Omit<RenderOptions, 'wrapper'>;
    navigationRouter?: NavigationRouter;
  } = {}
) => {
  testStore = createTestStore(preloadedState);
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders navigationRouter={navigationRouter} testStore={testStore}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// re-exporting everything
export * from '@testing-library/react';
// override render method
export { customRender as render, testStore, createTestStore };
