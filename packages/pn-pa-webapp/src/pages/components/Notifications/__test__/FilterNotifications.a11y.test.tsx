import * as React from 'react';

import { createMatchMedia } from '@pagopa-pn/pn-commons';

import {
  RenderResult,
  act,
  axe,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../../__test__/test-utils';
import FilterNotifications from '../FilterNotifications';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Filter Notifications Table Component - accessibility tests', () => {
  it('does not have basic accessibility issues - desktop', async () => {
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });

    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);

  it('does not have basic accessibility issues - mobile', async () => {
    window.matchMedia = createMatchMedia(800);
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });

    const button = result!.getByTestId('dialogToggleButton');
    fireEvent.click(button);

    const dialogForm = await waitFor(() => screen.getByTestId('filter-form'));
    expect(dialogForm).toBeInTheDocument();

    if (dialogForm) {
      const results = await axe(dialogForm);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});
