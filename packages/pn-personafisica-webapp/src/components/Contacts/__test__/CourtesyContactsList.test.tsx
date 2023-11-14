import * as React from 'react';
import { vi } from 'vitest';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { RenderResult, act, render } from '../../../__test__/test-utils';
import { CourtesyChannelType } from '../../../models/contacts';
import { CourtesyFieldType } from '../CourtesyContactItem';
import CourtesyContactsList from '../CourtesyContactsList';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

/*
In questo test viene testato solo il rendering dei componenti e non il flusso.
Il flusso completo viene testato nei singoli componenti, dove si potrà testare anche il cambio di stato di redux e le api.

Andrea Cimini - 6/09/2023
*/
describe('CourtesyContactsList Component', () => {
  let result: RenderResult | undefined;

  it('renders component - no contacts', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactsList recipientId="mock-recipient" contacts={[]} />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    const phoneInput = result?.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
    const emailInput = result?.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput).toHaveValue('');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue('');
    const buttons = result?.getAllByRole('button');
    expect(buttons![0]).toBeDisabled();
    expect(buttons![1]).toBeDisabled();
    expect(buttons![0].textContent).toMatch('courtesy-contacts.email-add');
    expect(buttons![1].textContent).toMatch('courtesy-contacts.phone-add');
  });

  it('renders components - contacts', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactsList recipientId="mock-recipient" contacts={digitalAddresses.courtesy} />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    const defaultPhone = digitalAddresses.courtesy.find(
      (addr) => addr.channelType === CourtesyChannelType.SMS && addr.senderId === 'default'
    );
    const defaultEmail = digitalAddresses.courtesy.find(
      (addr) => addr.channelType === CourtesyChannelType.EMAIL && addr.senderId === 'default'
    );

    const phoneInput = result?.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
    const emailInput = result?.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
    expect(phoneInput).not.toBeInTheDocument();
    expect(emailInput).not.toBeInTheDocument();
    const phoneNumber = result?.getByText(defaultPhone!.value);
    expect(phoneNumber).toBeInTheDocument();
    const email = result?.getByText(defaultEmail!.value);
    expect(email).toBeInTheDocument();
    const buttons = result?.getAllByRole('button');
    expect(buttons![0]).toBeEnabled();
    expect(buttons![1]).toBeEnabled();
    expect(buttons![0].textContent).toMatch('button.modifica');
    expect(buttons![1].textContent).toMatch('button.elimina');
    expect(buttons![2]).toBeEnabled();
    expect(buttons![3]).toBeEnabled();
    expect(buttons![2].textContent).toMatch('button.modifica');
    expect(buttons![3].textContent).toMatch('button.elimina');
  });
});
