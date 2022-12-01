import * as React from 'react';
import { act, RenderResult } from '@testing-library/react';
import { axe, render } from '../../../__test__/test-utils';
import CourtesyContactItem, { CourtesyFieldType } from '../CourtesyContactItem';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked verify description',
}));

describe('CourtesyContactItem component - accessibility tests', () => {
  const INPUT_VALID_PHONE = '3331234567';
  const INPUT_VALID_PHONE_2 = '3337654321';
  const SUBMITTED_VALID_PHONE = '+393331234567';
  const INPUT_INVALID_PHONE = '33312345';
  const VALID_CODE = 'verified';
  const VALID_EMAIL = 'prova@pagopa.it';
  const VALID_EMAIL_2 = 'testpagopa@gmail.it';
  const INVALID_EMAIL = 'testpagopa.it';

  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;

  it('type "phone" - add a new phone number - does not have basic accessibility issues', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value=""
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });

  it('type "phone" - change an existing phone number - does not have basic accessibility issues', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value={INPUT_VALID_PHONE}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });

  it('type "phone" - delete an existing phone number - does not have basic accessibility issues', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value={SUBMITTED_VALID_PHONE}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });

  it('type "email" - add a new email - does not have basic accessibility issues', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.EMAIL}
            value=""
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });

  it('type "email" - change an existing email - does not have basic accessibility issues', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.EMAIL}
            value={VALID_EMAIL}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });
  
});
