import * as React from 'react';
import { notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { act, axe, render, RenderResult } from "../../../__test__/test-utils";
import DesktopNotifications from '../DesktopNotifications';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));


describe('DesktopNotifications Component - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;
    await act(async () => {
      result = await render(
        <DesktopNotifications
          notifications={notificationsToFe.resultsPage}
          sort={{ orderBy: '', order: 'asc' }}
        />
      )
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 15000);

  it('does not have basic accessibility issues (empty notifications)', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;
    await act(async () => {
      result = await render(
        <DesktopNotifications
          notifications={[]}
          sort={{ orderBy: '', order: 'asc' }}
        />
      )
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 15000);
});
