import * as React from 'react';
import {
  doMockUseDispatch,
  mockedNotificationDetailPayment,
} from '../../../__mocks__/NotificationPayment.mock';
import { RenderResult, act, axe, render } from '../../../__test__/test-utils';
import NotificationPayment from '../NotificationPayment';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked-text',
}));

describe('NotificationPayment component - accessibility tests', () => {
  it('does not have basic accessibility issues (required status)', async () => {
    // mock dispatch
    doMockUseDispatch();

    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;
    await act(async () => {
      result = await render(
        <NotificationPayment
          iun="mocked-iun"
          notificationPayment={mockedNotificationDetailPayment}
          onDocumentDownload={() => {}}
        />
      );
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }

    jest.resetAllMocks();
    jest.clearAllMocks();
  });
});
