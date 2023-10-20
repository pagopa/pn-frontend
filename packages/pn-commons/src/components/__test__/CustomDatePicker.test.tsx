import currentLocale from 'date-fns/locale/it';
import React from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { render } from '../../test-utils';
import CustomDatePicker from '../CustomDatePicker';

const WrappedCustomDatePicker = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
      <CustomDatePicker
        label={'DatePicker'}
        onChange={() => {}}
        value={new Date()}
        slotProps={{
          textField: {
            inputProps: {
              placeholder: 'datepickerinput',
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

describe('test CustomDatePicker component', () => {
  it('renders the component', () => {
    const { getByPlaceholderText, container } = render(<WrappedCustomDatePicker />);
    const input = getByPlaceholderText(/datepickerinput/i);
    expect(container).toHaveTextContent(/datepicker/i);
    expect(input).toBeInTheDocument();
  });
});
