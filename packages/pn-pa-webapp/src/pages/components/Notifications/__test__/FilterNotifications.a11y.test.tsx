import * as React from 'react';
import { act, RenderResult } from '@testing-library/react';

import { render, axe, } from '../../../../__test__/test-utils';
import FilterNotifications from '../FilterNotifications';


jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));


describe('Filter Notifications Table Component - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<FilterNotifications showFilters/>);
    });

    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});
