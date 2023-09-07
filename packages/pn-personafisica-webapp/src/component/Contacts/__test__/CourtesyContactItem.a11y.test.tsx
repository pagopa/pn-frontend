import * as React from 'react';

import { RenderResult, act, axe, fireEvent, render } from '../../../__test__/test-utils';
import CourtesyContactItem, { CourtesyFieldType } from '../CourtesyContactItem';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('CourtesyContactItem component - accessibility tests', () => {
  const INPUT_VALID_PHONE = '3331234567';
  const VALID_EMAIL = 'prova@pagopa.it';
  let result: RenderResult | undefined;

  it('type "phone" - no phone added - does not have basic accessibility issues', async () => {
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

  it('type "phone" - phone added - does not have basic accessibility issues', async () => {
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

  it('type "phone" - phone added (edit mode) - does not have basic accessibility issues', async () => {
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

    const editButton = result?.getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton!);

    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });

  it('type "email" - no email added - does not have basic accessibility issues', async () => {
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

  it('type "email" - email added - does not have basic accessibility issues', async () => {
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

  it('type "email" - email added (edit mode) - does not have basic accessibility issues', async () => {
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

    const editButton = result?.getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton!);

    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });
});
