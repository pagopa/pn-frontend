import { vi } from 'vitest';

import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';

import {
  RenderResult,
  act,
  axe,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../__test__/test-utils';
import FilterNotifications from '../FilterNotifications';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

describe('Filter Notifications Table Component - accessibility tests', () => {
  const original = window.matchMedia;

  afterAll(() => {
    window.matchMedia = original;
  });

  it('does not have basic accessibility issues', async () => {
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<FilterNotifications showFilters />);
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
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
