import * as React from 'react';

import { axe, render } from '../../../__test__/test-utils';
import DropDownPartyMenuItem from '../DropDownParty';

describe('DropDownParty Component - accessibility tests', () => {
  it('is DropDownParty component accessible', async () => {
    const result = render(<DropDownPartyMenuItem name={'test1'} />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
