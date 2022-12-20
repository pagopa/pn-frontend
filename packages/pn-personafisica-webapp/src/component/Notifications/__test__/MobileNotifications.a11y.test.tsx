import * as React from 'react';
import { act, RenderResult } from "@testing-library/react";
import { notificationsToFe } from '../../../redux/dashboard/__test__/test-utils';
import { axe, render } from '../../../__test__/test-utils';
import MobileNotifications from '../MobileNotifications';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => (
    {
      t: (str: string) => str,
    }
  ),
}));

describe('MobileNotifications Component - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;
    await act(async () => {
      result = await render(
        <MobileNotifications
          notifications={notificationsToFe.resultsPage}
          sort={{ orderBy: '', order: 'asc' }}
        />
      )
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });

  it('does not have basic accessibility issues (empty notifications)', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;
    await act(async () => {
      result = await render(
        <MobileNotifications
          notifications={[]}
          sort={{ orderBy: 'sentAt', order: 'asc' }}
          onChangeSorting={() => {}}
        />
      )
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });
});
