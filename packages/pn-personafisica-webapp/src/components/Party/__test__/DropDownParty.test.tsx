import React from 'react';

import { render } from '../../../__test__/test-utils';
import DropDownPartyMenuItem from '../DropDownParty';

describe('DropDownParty Component', () => {
  it('renders the dropdown menu', () => {
    const { container } = render(<DropDownPartyMenuItem name={'test1'} />);
    expect(container).toHaveTextContent(/test1/i);
  });
});
