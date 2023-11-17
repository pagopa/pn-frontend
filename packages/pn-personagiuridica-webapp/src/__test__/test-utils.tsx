import { configureAxe, toHaveNoViolations } from 'jest-axe';
import React, { ReactElement, ReactNode } from 'react';
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
  testStore = configureStore({
    reducer: appReducers,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders navigationRouter={navigationRouter} testStore={testStore}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

const axe = configureAxe({
  rules: {
    region: { enabled: false },
  },
});

const createMockedStore = (preloadedState: any) =>
  configureStore({
    reducer: appReducers,
    preloadedState,
  });

expect.extend(toHaveNoViolations);

function getTestStore() {
  return testStore;
}

// re-exporting everything
export * from '@testing-library/react';
// override render method
export { axe, createMockedStore, customRender as render, testStore, getTestStore };
