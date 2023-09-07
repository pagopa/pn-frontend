import currentLocale from 'date-fns/locale/it';
import React from 'react';

import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { fireEvent } from '@testing-library/react';

import { render } from '../../test-utils';
import CustomDatePicker from '../CustomDatePicker';

const WrappedCustomDatePicker = () => {
  return (
    <LocalizationProvider
      id="startDate"
      name="startDate"
      dateAdapter={AdapterDateFns}
      adapterLocale={currentLocale}
    >
      <CustomDatePicker
        label={'DatePicker'}
        onChange={() => {}}
        value={new Date()}
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
    </LocalizationProvider>
  );
};

describe('test CustomDatePicker component', () => {
  it('renders the component', () => {
    const result = render(<WrappedCustomDatePicker />);
    const input = result.getByPlaceholderText(/datepickerinput/i);

    expect(result.container).toHaveTextContent(/datepicker/i);
    fireEvent.click(input);
  });
});
