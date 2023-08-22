import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import React, { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { EnhancedStore, Store, configureStore } from '@reduxjs/toolkit';
import { RenderOptions, fireEvent, render, waitFor } from '@testing-library/react';

import { RootState, appReducers } from '../redux/store';

let testStore: EnhancedStore<RootState>;

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
  testStore = configureStore({
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

type MockMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'ANY';
type MockCodes = 200 | 204 | 500 | 401 | 400 | 403 | 451;

/**
 * Utility function to mock api response
 * @param client Axios client or Mock Adapter instance
 * @param method the api method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'ANY
 * @param path the api path
 * @param code the response code
 * @param request body request
 * @param response response
 * @param requestHeader request header
 * @param responseHeader response header
 * @returns the mock instance
 */
function mockApi(
  client: AxiosInstance | MockAdapter,
  method: MockMethods,
  path: string,
  code: MockCodes,
  request?: any,
  response?: any,
  requestHeader?: any,
  responseHeader?: any
): MockAdapter {
  const mock = client instanceof MockAdapter ? client : new MockAdapter(client);
  switch (method) {
    case 'GET':
      mock.onGet(path, request, requestHeader).reply(code, response, responseHeader);
      break;
    case 'POST':
      mock.onPost(path, request, requestHeader).reply(code, response, responseHeader);
      break;
    case 'PUT':
      mock.onPut(path, request, requestHeader).reply(code, response, responseHeader);
      break;
    case 'DELETE':
      mock.onDelete(path, request, requestHeader).reply(code, response, responseHeader);
      break;
    case 'PATCH':
      mock.onPatch(path, request, requestHeader).reply(code, response, responseHeader);
      break;
    case 'ANY':
      mock.onAny(path, request, requestHeader).reply(code, response, responseHeader);
    default:
      break;
  }
  return mock;
}

// utility functions
/**
 * Test the existence of a field, its label and optionally its value
 * @form form element
 * @elementName element name
 * @label element's label
 * @value the expected value of the element
 */
function testFormElements(
  form: HTMLFormElement,
  elementName: string,
  label: string,
  value?: string | number
) {
  const formElement = form.querySelector(
    `input[id="${elementName}"], input[name="${elementName}"]`
  );
  expect(formElement).toBeInTheDocument();
  const formElementLabel = form.querySelector(`label[for="${elementName}"]`);
  expect(formElementLabel).toBeInTheDocument();
  expect(formElementLabel).toHaveTextContent(label);
  if (value !== undefined && value !== null) {
    expect(formElement).toHaveValue(value);
  }
}

/**
 * Fire change event on an input and check its value
 * @container container element
 * @elementName element name
 * @value the expected value of the element
 */
async function testInput(container: HTMLElement, elementName: string, value: string | number) {
  const input = container.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, { target: { value } });
  await waitFor(() => {
    expect(input).toHaveValue(value);
  });
}

expect.extend(toHaveNoViolations);

export * from '@testing-library/react';
export { customRender as render, testStore };
export { axe };
// utility functions
export { mockApi, testInput, testFormElements };
