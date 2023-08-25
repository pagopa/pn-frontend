import { configureAxe, toHaveNoViolations } from 'jest-axe';
import React, { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { Store, configureStore } from '@reduxjs/toolkit';
import { RenderOptions, render } from '@testing-library/react';

import { appReducers } from '../redux/store';

const AllTheProviders = ({ children, testStore }: { children: ReactNode; testStore: Store }) => (
  <BrowserRouter>
    <Provider store={testStore}>{children}</Provider>
  </BrowserRouter>
);

const customRender = (
  ui: ReactElement,
  {
    preloadedState,
    renderOptions,
  }: { preloadedState?: any; renderOptions?: Omit<RenderOptions, 'wrapper'> } = {}
) => {
  const testStore = configureStore({
    reducer: appReducers,
    preloadedState,
  });
  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders testStore={testStore}>{children}</AllTheProviders>,
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

// re-exporting everything
export * from '@testing-library/react';
// override render method
export { axe, customRender as render, createMockedStore };
