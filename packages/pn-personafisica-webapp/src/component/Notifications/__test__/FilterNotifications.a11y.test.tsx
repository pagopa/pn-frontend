import * as React from 'react';
import { RenderResult, act } from '@testing-library/react';

import { axe, render } from '../../../__test__/test-utils';
import FilterNotifications from '../FilterNotifications';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
  };
});

describe('Filter Notifications Table Component - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<FilterNotifications showFilters/>);
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });
});
