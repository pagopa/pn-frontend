import mediaQuery from 'css-mediaquery';
import { ReactElement, ReactNode } from 'react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material';
import { Store, configureStore } from '@reduxjs/toolkit';
import { RenderOptions, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { appStateSlice } from './redux/slices/appStateSlice';

const AllTheProviders = ({ children, testStore }: { children: ReactNode; testStore: Store }) => {
  const theme = createTheme({});
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Provider store={testStore}>{children}</Provider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  {
    preloadedState,
    renderOptions,
  }: { preloadedState?: any; renderOptions?: Omit<RenderOptions, 'wrapper'> } = {}
) => {
  const testStore = configureStore({
    reducer: { appState: appStateSlice.reducer },
    preloadedState,
  });
  return {
    ...render(ui, {
      wrapper: ({ children }) => (
        <AllTheProviders testStore={testStore}>{children}</AllTheProviders>
      ),
      ...renderOptions,
    }),
    testStore,
  };
};

// utility function
/**
 * Test the options list of a select, fire change event and check its value
 * @container container element
 * @elementName element name
 * @options the options list
 * @optToSelect the option to select
 */
async function testSelect(
  container: HTMLElement,
  elementName: string,
  options: Array<{ label: string; value: string }>,
  optToSelect: number
) {
  const selectInput = container.querySelector(`input[name="${elementName}"]`);
  const selectButton = container.querySelector(`div[id="${elementName}"]`);
  fireEvent.mouseDown(selectButton!);
  const selectOptionsContainer = screen.getByRole('presentation');
  expect(selectOptionsContainer).toBeInTheDocument();
  const selectOptionsList = within(selectOptionsContainer).getByRole('listbox');
  expect(selectOptionsList).toBeInTheDocument();
  const selectOptionsListItems = within(selectOptionsList).getAllByRole('option');
  expect(selectOptionsListItems).toHaveLength(options.length);
  selectOptionsListItems.forEach((opt, index) => {
    expect(opt).toHaveTextContent(options[index].label);
  });
  fireEvent.click(selectOptionsListItems[optToSelect]);
  await waitFor(() => {
    expect(selectInput).toHaveValue(options[optToSelect].value);
  });
}

/** This function simulate media query and is useful to test differences between mobile and desktop view */
function createMatchMedia(width: number) {
  return (query: string): MediaQueryList => ({
    matches: mediaQuery.match(query, { width }) as boolean,
    media: '',
    addListener: () => {},
    removeListener: () => {},
    onchange: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
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
async function testAutocomplete(
  container: Element,
  elementName: string,
  options: Array<{ id: string; name: string }>,
  mustBeOpened: boolean,
  optToSelect?: number,
  closeOnSelect?: boolean
) {
  const autocomplete = within(container as HTMLElement).getByTestId(elementName);
  if (mustBeOpened) {
    const button = autocomplete.querySelector('button[class*="MuiAutocomplete-popupIndicator"]');
    fireEvent.click(button!);
  }
  const dropdown = (await waitFor(() =>
    document.querySelector('[role="presentation"][class*="MuiAutocomplete-popper"')
  )) as HTMLElement;
  expect(dropdown).toBeInTheDocument();
  const dropdownOptionsList = within(dropdown).getByRole('listbox') as HTMLElement;
  expect(dropdownOptionsList).toBeInTheDocument();
  const dropdownOptionsListItems = within(dropdownOptionsList).getAllByRole('option');
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

/**
 * Test the existence of a field, its label and optionally its value
 * @container container element
 * @elementName element name
 * @label element's label
 * @value the expected value of the element
 */
function testFormElements(
  container: HTMLElement,
  elementName: string,
  label: string,
  value?: string | number
) {
  const formElement = container.querySelector(
    `input[id="${elementName}"], input[name="${elementName}"]`
  );
  expect(formElement).toBeInTheDocument();
  const formElementLabel = container.querySelector(`label[for="${elementName}"]`);
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
 * @blur set if a blur event must be fired after input change
 */
async function testInput(
  container: HTMLElement,
  elementName: string,
  value: string | number,
  blur: boolean = false
) {
  const input = container.querySelector(`input[name="${elementName}"]`);
  fireEvent.change(input!, { target: { value } });
  await waitFor(() => {
    expect(input).toHaveValue(value);
  });
  if (blur) {
    fireEvent.blur(input!);
  }
}

/**
 * Test radio options and optionally select a value
 * @container container element
 * @dataTestId data-testid attribute
 * @values list of options
 * @expectedValue desired value
 * @select set if option must be selected
 */
async function testRadio(
  container: HTMLElement,
  dataTestId: string,
  values: Array<string>,
  expectedValue?: number,
  select?: boolean
) {
  const radioButtons = container?.querySelectorAll(`[data-testid="${dataTestId}"]`);
  expect(radioButtons).toHaveLength(values.length);
  values.forEach((value, index) => {
    expect(radioButtons[index]).toHaveTextContent(value);
  });
  if (expectedValue !== undefined) {
    if (select) {
      fireEvent.click(radioButtons[expectedValue]);
    }
    await waitFor(() => {
      const radioInput = radioButtons[expectedValue].querySelector('input');
      expect(radioInput!).toBeChecked();
    });
  }
}

export * from '@testing-library/react';
export {
  customRender as render,
  testSelect,
  createMatchMedia,
  testAutocomplete,
  testFormElements,
  testInput,
  testRadio,
};
