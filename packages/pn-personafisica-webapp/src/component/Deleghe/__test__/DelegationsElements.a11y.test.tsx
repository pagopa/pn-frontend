import * as React from 'react';
import { axe, render } from '../../../__test__/test-utils';
import { Menu } from '../DelegationsElements';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('DelegationElements - accessibility tests', () => {
  it('is Menu component accessible', async ()=>{
    const result = render(<Menu />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
