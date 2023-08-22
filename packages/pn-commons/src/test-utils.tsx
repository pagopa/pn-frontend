import mediaQuery from 'css-mediaquery';
import { ReactElement, ReactNode } from 'react';
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
  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders testStore={testStore}>{children}</AllTheProviders>,
    ...renderOptions,
  });
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
  const selectOptionsContainer = await screen.findByRole('presentation');
  expect(selectOptionsContainer).toBeInTheDocument();
  const selectOptionsList = await within(selectOptionsContainer).findByRole('listbox');
  expect(selectOptionsList).toBeInTheDocument();
  const selectOptionsListItems = await within(selectOptionsList).findAllByRole('option');
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

export * from '@testing-library/react';
export { customRender as render };
// utility functions
export { testSelect, createMatchMedia };
