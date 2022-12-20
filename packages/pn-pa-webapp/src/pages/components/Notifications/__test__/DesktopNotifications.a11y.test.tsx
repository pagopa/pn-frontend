import * as React from 'react';
import { act, RenderResult } from '@testing-library/react';

import { notificationsToFe } from '../../../../redux/dashboard/__test__/test-utils';
import { axe, render } from '../../../../__test__/test-utils';
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
      result = render(
        <DesktopNotifications
          notifications={notificationsToFe.resultsPage}
          sort={{ orderBy: '', order: 'asc' }}
          onManualSend={() => {}}
          onApiKeys={() => {}}
        />
      );
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  }, 15000);

  it('does not have basic accessibility issues (empty notifications)', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={[]}
          sort={{ orderBy: '', order: 'asc' }}
          onManualSend={() => {}}
          onApiKeys={() => {}}
        />
      );
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  }, 15000);
});
