import { render, RenderOptions, fireEvent, waitFor, within, screen } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';

const AllTheProviders = ({children}: {children: ReactNode}) => {
  const theme = createTheme({});
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options})

export * from '@testing-library/react'
export {customRender as render}

export async function testSelect(
  form: HTMLElement,
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
  fireEvent.click(selectOptionsListItems[optToSelect]);
  await waitFor(() => {
    expect(selectInput).toHaveValue(options[optToSelect].value);
  });
}

export const mockDropdownItems = [
  {key: 'mock-id-1', value: 'mock-value-1', label: 'mock-label-1'},
  {key: 'mock-id-2', value: 'mock-value-2', label: 'mock-label-2'},
  {key: 'mock-id-3', value: 'mock-value-3', label: 'mock-label-3'},
  {key: 'mock-id-4', value: 'mock-value-4', label: 'mock-label-4'},
]