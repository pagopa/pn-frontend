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

/**
 * Test radio options and optionally select a value
 * @container container element
 * @dataTestId data-testid attribute
 * @values list of options
 * @valueToSelect option to select
 */
async function testRadio(
  container: HTMLElement,
  dataTestId: string,
  values: Array<string>,
  valueToSelect?: number
) {
  const radioButtons = container?.querySelectorAll(`[data-testid="${dataTestId}"]`);
  expect(radioButtons).toHaveLength(values.length);
  values.forEach((value, index) => {
    expect(radioButtons[index]).toHaveTextContent(value);
  });
  if (valueToSelect !== undefined) {
    fireEvent.click(radioButtons[valueToSelect]);
    await waitFor(() => {
      const radioInput = radioButtons[valueToSelect].querySelector('input');
      expect(radioInput!).toBeChecked();
    });
  }
}

expect.extend(toHaveNoViolations);

export * from '@testing-library/react';
export { customRender as render, testStore };
export { axe };
// utility functions
export { testInput, testFormElements, testRadio };
