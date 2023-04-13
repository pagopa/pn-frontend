import React, { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { configureStore, Store } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import { configureAxe, toHaveNoViolations } from 'jest-axe';

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
expect.extend(toHaveNoViolations);

/**
 * Utility function to mock api response
 * @param client Axios client
 * @param method the api method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
 * @param path the api path
 * @param code the response code
 * @param request body request
 * @param response response
 * @returns the mock instance
 */
function mockApi(
  client: AxiosInstance,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  path: string,
  code: 200,
  request?: any,
  response?: any
): MockAdapter {
  const mock = new MockAdapter(client);
  switch (method) {
    case 'GET':
      mock.onGet(path).reply(code, response);
      break;
    case 'POST':
      mock.onPost(path, request).reply(code, response);
      break;
    case 'PUT':
      mock.onPut(path, request).reply(code, response);
      break;
    case 'DELETE':
      mock.onDelete(path).reply(code, response);
      break;
    case 'PATCH':
      mock.onPatch(path, request).reply(code, response);
      break;
    default:
      break;
  }
  return mock;
}

// re-exporting everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
export { axe };
// utility functions
export { mockApi };
