import * as React from 'react';
import { render, axe } from '../../__test__/test-utils';
import {
  notificationToFe,
  notificationToFeMultiRecipient,
} from '../../redux/notification/__test__/test-utils';
import NotificationDetail from '../NotificationDetail.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('NotificationDetail Page - accessibility tests', () => {
  it('one recipient - does not have basic accessibility issues rendering the page', async () => {
    const result = render(<NotificationDetail />, {
      preloadedState: {
        notificationState: {
          notification: notificationToFe,
          documentDownloadUrl: 'mocked-download-url',
          legalFactDownloadUrl: 'mocked-legal-fact-url',
        },
        userState: { user: { organization: { id: 'mocked-sender' } } },
      },
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);


  it('multi recipient - does not have basic accessibility issues rendering the page', async () => {
    const result = render(<NotificationDetail />, {
      preloadedState: {
        notificationState: {
          notification: notificationToFeMultiRecipient,
          documentDownloadUrl: 'mocked-download-url',
          legalFactDownloadUrl: 'mocked-legal-fact-url',
        },
        userState: { user: { organization: { id: 'mocked-sender' } } },
      },
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});


