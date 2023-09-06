import { configureAxe, toHaveNoViolations } from 'jest-axe';
import React, { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { Store, configureStore } from '@reduxjs/toolkit';
import { RenderOptions, fireEvent, render, waitFor, within } from '@testing-library/react';

import { appReducers } from '../redux/store';

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

const createMockedStore = (preloadedState: any) =>
  configureStore({
    reducer: appReducers,
    preloadedState,
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
  const testStore = configureStore({
    reducer: appReducers,
    preloadedState,
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
    const button = autocomplete.querySelector('.MuiAutocomplete-popupIndicator') as Element;
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
export { axe, createMockedStore, customRender as render };
