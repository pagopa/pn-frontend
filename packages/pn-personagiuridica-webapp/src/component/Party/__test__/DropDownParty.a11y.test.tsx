import * as React from 'react';
import { render } from '@testing-library/react';
import { axe } from '../../../__test__/test-utils';
import DropDownPartyMenuItem from '../DropDownParty';

describe('DropDownParty Component - accessibility tests', () => {
  it('is DropDownParty component accessible', async () => {
    const result = render(<DropDownPartyMenuItem name={'test1'} />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
