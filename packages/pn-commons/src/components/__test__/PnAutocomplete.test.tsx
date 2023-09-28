import React from 'react';

import { TextField } from '@mui/material';

import { fireEvent, render, waitFor, within } from '../../test-utils';
import PnAutocomplete from '../PnAutocomplete';

describe('PnAutocomplete Component', () => {
  it('renders custom autocomplete', async () => {
    // render component
    const result = render(
      <PnAutocomplete
        options={['OptionA', 'OptionB']}
        renderInput={(params) => <TextField {...params} label={'Input label'} />}
      />
    );
    expect(result.container).toHaveTextContent(/Input label/i);
    const button = result.container.querySelector('.MuiAutocomplete-popupIndicator');
    fireEvent.click(button!);
    const dropdown = await waitFor(() =>
      result.baseElement.querySelector('[role="presentation"][class^="MuiAutocomplete-popper"')
    );
    expect(dropdown).toBeInTheDocument();
    const dropdownOptionsList = within(dropdown as HTMLElement).getByRole('listbox');
    expect(dropdownOptionsList).toBeInTheDocument();
    const dropdownOptionsListItems = within(dropdownOptionsList!).getAllByRole('option');
    expect(dropdownOptionsListItems).toHaveLength(2);
    expect(dropdownOptionsListItems[0]).toHaveTextContent('OptionA');
    expect(dropdownOptionsListItems[1]).toHaveTextContent('OptionB');
  });
});
