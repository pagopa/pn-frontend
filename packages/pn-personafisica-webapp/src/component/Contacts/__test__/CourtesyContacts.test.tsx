import * as React from 'react';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { RenderResult, act, render } from '../../../__test__/test-utils';
import { CourtesyChannelType } from '../../../models/contacts';
import { CourtesyFieldType } from '../CourtesyContactItem';
import CourtesyContacts from '../CourtesyContacts';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

/*
In questo test viene testato solo il rendering dei componenti e non il flusso.
Il flusso completo viene testato nella pagina dei contatti, dove si può testare anche il cambio di stato di redux e le api

Andrea Cimini - 6/09/2023
*/
describe('CourtesyContacts Component', () => {
  let result: RenderResult | undefined;

  it('renders component - no contacts', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContacts recipientId="mock-recipient" contacts={[]} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const avatar = result?.getByText('Email');
    expect(avatar).toBeInTheDocument();
    const title = result?.getByRole('heading');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('courtesy-contacts.subtitle');
    const body = result?.getByTestId('DigitalContactsCardBody');
    expect(body).toHaveTextContent('courtesy-contacts.title');
    expect(body).toHaveTextContent('courtesy-contacts.description');
    const disclaimer = result?.getByTestId('contacts disclaimer');
    expect(disclaimer).toBeInTheDocument();
    // check inputs
    const phoneInput = result?.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
    const emailInput = result?.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
    expect(phoneInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  it('renders component - contacts', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContacts recipientId="mock-recipient" contacts={digitalAddresses.courtesy} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const defaultPhone = digitalAddresses.courtesy.find(
      (addr) => addr.channelType === CourtesyChannelType.SMS && addr.senderId === 'default'
    );
    const defaultEmail = digitalAddresses.courtesy.find(
      (addr) => addr.channelType === CourtesyChannelType.EMAIL && addr.senderId === 'default'
    );
    // check contacts
    const phoneNumber = result?.getByText(defaultPhone!.value);
    expect(phoneNumber).toBeInTheDocument();
    const email = result?.getByText(defaultEmail!.value);
    expect(email).toBeInTheDocument();
  });
});
