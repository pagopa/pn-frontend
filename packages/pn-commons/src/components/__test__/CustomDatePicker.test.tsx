import React from 'react';

import { TextField } from '@mui/material';

import { RenderResult, fireEvent, render, screen, waitFor } from '../../test-utils';
import CustomDatePicker from '../CustomDatePicker';

const RenderDatePicker = ({ language = 'it' }: { language?: string }) => (
  <CustomDatePicker
    label={'DatePicker'}
    onChange={() => {}}
    value={new Date('01/01/2023')}
    language={language}
    renderInput={(params) => (
      <TextField
        {...params}
        inputProps={{
          ...params.inputProps,
          placeholder: 'datepickerinput',
        }}
      />
    )}
  />
);
describe('test CustomDatePicker component', () => {
  it('renders the component', () => {
    const { getByPlaceholderText, container } = render(<RenderDatePicker />);
    const input = getByPlaceholderText(/datepickerinput/i);
    expect(container).toHaveTextContent(/datepicker/i);
    expect(input).toBeInTheDocument();
  });
});

describe('test CustomDatePicker languages', () => {
  const languages = [
    {
      language: 'it',
      month: 'gennaio',
    },
    {
      language: 'en',
      month: 'january',
    },
    {
      language: 'fr',
      month: 'janvier',
    },
    {
      language: 'de',
      month: 'januar',
    },
    {
      language: 'sl',
      month: 'januar',
    },
  ];
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });
  languages.forEach((language) => {
    it(`check january month to be ${language.month} in ${language.language}`, async () => {
      const { container, getByRole } = render(<RenderDatePicker language={language.language} />);
      expect(container).toHaveTextContent(/datepicker/i);
      const button = getByRole('button');
      await waitFor(() => fireEvent.click(button));
      const regExMonth = new RegExp(`${language.month}`, 'i');
      expect(screen.getByText(regExMonth)).toBeInTheDocument();
    });
  });
});
