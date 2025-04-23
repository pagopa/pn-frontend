import mediaQuery from 'css-mediaquery';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { ThemeProvider, createTheme } from '@mui/material';
import { Store, configureStore } from '@reduxjs/toolkit';
import {
  Matcher,
  MatcherOptions,
  RenderOptions,
  fireEvent,
  queryByAttribute,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { appStateSlice } from './redux/slices/appStateSlice';
import { formatDate } from './utility';
import { initLocalization } from './utility/localization.utility';

type NavigationRouter = 'default' | 'none';

const theme = createTheme({});

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
        <ThemeProvider theme={theme}>
          <Provider store={testStore}>{children}</Provider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <Provider store={testStore}>{children}</Provider>
    </ThemeProvider>
  );
};

const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: { appState: appStateSlice.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
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
  const testStore = createTestStore(preloadedState);
  return {
    ...render(ui, {
      wrapper: ({ children }) => (
        <AllTheProviders testStore={testStore} navigationRouter={navigationRouter}>
          {children}
        </AllTheProviders>
      ),
      ...renderOptions,
    }),
    testStore,
  };
};

// utility function
/** This function simulate media query and is useful to test differences between mobile and desktop view */
function createMatchMedia(width: number, height?: number) {
  return (query: string): MediaQueryList => ({
    matches: mediaQuery.match(query, { width, height }),
    media: '',
    addListener: () => {},
    removeListener: () => {},
    onchange: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
}

/** This function disable the console logging methods */
function disableConsoleLogging(method: 'log' | 'error' | 'info' | 'warn') {
  beforeAll(() => {
    vi.spyOn(console, method).mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });
}

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
  const selectButton = container.querySelector(
    `div[id="${elementName}"], div[data-testid="${elementName}"] [role="combobox"]`
  );
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
  const autocompleteInput = autocomplete.querySelector('input');
  expect(autocompleteInput).toBeInTheDocument();
  if (mustBeOpened) {
    await userEvent.click(autocompleteInput!);
  }
  const dropdown = await waitFor(() =>
    document.querySelector<HTMLElement>('[role="presentation"][class*="MuiAutocomplete-popper"]')
  );
  expect(dropdown).toBeInTheDocument();
  const dropdownOptionsList = within(dropdown!).getByRole('listbox');
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
  label?: string,
  value?: string | number
) {
  const formElement = container.querySelector(
    `input[id="${elementName}"], input[name="${elementName}"], textarea[name="${elementName}"]`
  );
  expect(formElement).toBeInTheDocument();
  if (label) {
    const formElementLabel = container.querySelector(`label[for="${elementName}"]`);
    expect(formElementLabel).toBeInTheDocument();
    expect(formElementLabel).toHaveTextContent(label);
  }
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
  const input = container.querySelector(
    `input[name="${elementName}"], textarea[name="${elementName}"]`
  );
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

async function testCalendar(
  form: HTMLFormElement | HTMLDivElement,
  elementName: string,
  dateToSelect: Date,
  dateSelected: Date = new Date(),
  isMobile: boolean = false
) {
  const input = form.querySelector(`input[name="${elementName}"]`);
  // on mobile version we don't have the button, but
  // the modal opens when the input is focused
  if (isMobile) {
    fireEvent.click(input!);
  } else {
    const button = input!.parentElement!.querySelector(`button`);
    fireEvent.click(button!);
  }
  const dialog = await waitFor(() => document.querySelector('.PnDatePicker') as HTMLElement);
  expect(dialog).toBeInTheDocument();
  // get year, month and day
  const year = dateToSelect.getFullYear();
  const month = dateToSelect.getMonth() + 1;
  const day = dateToSelect.getDate();
  // compare with date initially selected
  const selectedYear = dateSelected.getFullYear();
  const selectedMonth = dateSelected.getMonth() + 1;
  // select the new date
  if (selectedYear !== year) {
    const yearIcon = within(dialog).getByTestId('ArrowDropDownIcon');
    expect(yearIcon).toBeInTheDocument();
    fireEvent.click(yearIcon);
    const yearButton = document
      .evaluate(`//button[text()="${year.toString()}"]`, dialog, null, XPathResult.ANY_TYPE, null)
      .iterateNext();
    expect(yearButton).toBeInTheDocument();
    fireEvent.click(yearButton!);
  }
  if (selectedMonth !== month) {
    const diff = month - selectedMonth;
    const monthIcon =
      diff > 0
        ? within(dialog).getByTestId('ArrowRightIcon')
        : within(dialog).getByTestId('ArrowLeftIcon');
    expect(monthIcon).toBeInTheDocument();
    // eslint-disable-next-line functional/no-let
    for (let i = 0; i < Math.abs(diff); i++) {
      fireEvent.click(monthIcon);
    }
  }
  // select the day to close the dialog
  const dateButton = document.evaluate(
    `//button[text()="${day}"]`,
    dialog,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  fireEvent.click(dateButton.iterateNext()!);
  await waitFor(() => {
    expect(input).toHaveValue(formatDate(dateToSelect.toISOString(), false));
    expect(dialog).not.toBeInTheDocument();
  });
}

/**
 * Init localization and set the translate function to a default value
 */
function initLocalizationForTest() {
  const mockedTranslationFn = (
    namespace: string | Array<string>,
    path: string,
    data?: { [key: string]: any }
  ) => (data ? `${namespace} - ${path} - ${JSON.stringify(data)}` : `${namespace} - ${path}`);
  initLocalization(mockedTranslationFn);
}
/**
 * Get element by id
 * @param container
 * @param id
 * @param options
 * @returns HTMLElement | null
 */
const queryById: (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions
) => HTMLElement | null = (container: HTMLElement, id: Matcher, options?: MatcherOptions) =>
  queryByAttribute('id', container, id, options);

/**
 * Get element by id
 * @param container
 * @param id
 * @param options
 * @returns HTMLElement
 */
const getById: (container: HTMLElement, id: Matcher, options?: MatcherOptions) => HTMLElement = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions
) => {
  const elem = queryByAttribute('id', container, id, options);
  if (!elem) {
    throw new Error(`cannot find an element with id ${id}`);
  }
  return elem;
};

export * from '@testing-library/react';
export {
  customRender as render,
  testSelect,
  createMatchMedia,
  testAutocomplete,
  testFormElements,
  testInput,
  testRadio,
  testCalendar,
  initLocalizationForTest,
  getById,
  queryById,
  createTestStore,
  theme,
  disableConsoleLogging,
};
