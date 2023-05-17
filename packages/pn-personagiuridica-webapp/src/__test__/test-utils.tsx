import React, { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { configureStore, Store } from '@reduxjs/toolkit';
import { fireEvent, render, RenderOptions, waitFor, within, screen } from '@testing-library/react';
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

/**
 * Utility function to test autocomplete component
 * @param form html element representing the form
 * @param elementName data-testid of the autocomplete element
 * @param options dropdown options
 * @param mustBeOpened flag to set if dropdown must be opened
 * @param optToSelect option to select
 * @returns the mock instance
 */
export async function testAutocomplete(
  container: Element,
  elementName: string,
  options: Array<{ id: string; name: string }>,
  mustBeOpened: boolean,
  optToSelect?: number,
  closeOnSelect?: boolean
) {
  const autocomplete = container.querySelector(`[data-testid="${elementName}"]`) as Element;
  if (mustBeOpened) {
    const button = autocomplete.querySelector('button[title="Open"]') as Element;
    fireEvent.click(button);
  }
  const dropdown = (await waitFor(() =>
    document.querySelector('[role="presentation"][class^="MuiAutocomplete-popper"')
  )) as HTMLElement;
  expect(dropdown).toBeInTheDocument();
  const dropdownOptionsList = (await within(dropdown).queryByRole('listbox')) as HTMLElement;
  expect(dropdownOptionsList).toBeInTheDocument();
  const dropdownOptionsListItems = await within(dropdownOptionsList).queryAllByRole('option');
  expect(dropdownOptionsListItems).toHaveLength(options.length);
  dropdownOptionsListItems.forEach((opt, index) => {
    expect(opt).toHaveTextContent(options[index].name);
  });
  if (optToSelect !== undefined) {
    fireEvent.click(dropdownOptionsListItems[optToSelect]);
    if (closeOnSelect) {
      await waitFor(() => expect(dropdown).not.toBeInTheDocument());
    }
  }
}

// re-exporting everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
export { axe };
// utility functions
export { mockApi };
