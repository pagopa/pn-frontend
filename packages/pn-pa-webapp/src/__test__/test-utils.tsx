import React, { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, Store } from '@reduxjs/toolkit';
import { fireEvent, render, RenderOptions, waitFor, within, screen } from '@testing-library/react';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';

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

const renderWithoutRouter = (
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
    wrapper: ({ children }) => <Provider store={testStore}>{children}</Provider>,
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
 * @returns the mock instance
 */
function mockApi(
  client: AxiosInstance | MockAdapter,
  method: MockMethods,
  path: string,
  code: MockCodes,
  request?: any,
  response?: any
): MockAdapter {
  const mock = client instanceof MockAdapter ? client : new MockAdapter(client);
  switch (method) {
    case 'GET':
      mock.onGet(path, request).reply(code, response);
      break;
    case 'POST':
      mock.onPost(path, request).reply(code, response);
      break;
    case 'PUT':
      mock.onPut(path, request).reply(code, response);
      break;
    case 'DELETE':
      mock.onDelete(path, request).reply(code, response);
      break;
    case 'PATCH':
      mock.onPatch(path, request).reply(code, response);
      break;
    case 'ANY':
      mock.onAny(path, request).reply(code, response);
    default:
      break;
  }
  return mock;
}

// utility functions
/**
 * @form form element
 * @elementName element name
 * @label element's label
 * @findById set true if a form component doesn't have "name" prop like Autocomplete component
 */
export function testFormElements(
  form: HTMLFormElement,
  elementName: string,
  label: string,
  findById?: boolean
) {
  const formElement = form.querySelector(`input[${findById ? 'id' : 'name'}="${elementName}"]`);
  expect(formElement).toBeInTheDocument();
  const formElementLabel = form.querySelector(`label[for="${elementName}"]`);
  expect(formElementLabel).toBeInTheDocument();
  expect(formElementLabel).toHaveTextContent(label);
}

export async function testInput(
  form: HTMLFormElement,
  elementName: string,
  value: string | number
) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, { target: { value } });
  await waitFor(() => {
    expect(input).toHaveValue(value);
  });
}

export async function testSelect(
  form: HTMLFormElement,
  elementName: string,
  options: Array<{ label: string; value: string }>,
  optToSelect: number
) {
  const selectInput = form.querySelector(`input[name="${elementName}"]`);
  const selectButton = form.querySelector(`div[id="${elementName}"]`);
  fireEvent.mouseDown(selectButton!);
  const selectOptionsContainer = await screen.findByRole('presentation');
  expect(selectOptionsContainer).toBeInTheDocument();
  const selectOptionsList = await within(selectOptionsContainer).findByRole('listbox');
  expect(selectOptionsList).toBeInTheDocument();
  const selectOptionsListItems = await within(selectOptionsList).findAllByRole('option');
  expect(selectOptionsListItems).toHaveLength(options.length);
  selectOptionsListItems.forEach((opt, index) => {
    expect(opt).toHaveTextContent(options[index].label);
  });
  await waitFor(() => {
    fireEvent.click(selectOptionsListItems[optToSelect]);
    expect(selectInput).toHaveValue(options[optToSelect].value);
  });
}

expect.extend(toHaveNoViolations);

export * from '@testing-library/react';
export { customRender as render };
export { renderWithoutRouter };
export { axe };
// utility functions
export { mockApi };
