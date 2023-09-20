import React from 'react';

import { SpecialContactsProvider } from '@pagopa-pn/pn-commons';

import { RenderResult, act, fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import SpecialContactElem from '../SpecialContactElem';

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
describe('SpecialContactElem Component', () => {
  let result: RenderResult | undefined;

  it('renders SpecialContactElem', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                senderName: 'Mocked Sender',
                mail: 'mocked@mail.it',
                pec: 'mocked@pec.it',
              }}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result?.container).toHaveTextContent('Mocked Sender');
    const specialContactForms = result?.getAllByTestId('specialContactForm');
    expect(specialContactForms).toHaveLength(2);
    expect(specialContactForms![0]).toHaveTextContent('mocked@pec.it');
    expect(specialContactForms![1]).toHaveTextContent('mocked@mail.it');
    const firstFormButtons = specialContactForms![0].querySelectorAll('button');
    expect(firstFormButtons).toHaveLength(2);
    expect(firstFormButtons[0]).toHaveTextContent('button.modifica');
    expect(firstFormButtons[1]).toHaveTextContent('button.elimina');
    const secondFormButtons = specialContactForms![1].querySelectorAll('button');
    expect(secondFormButtons).toHaveLength(2);
    expect(secondFormButtons[0]).toHaveTextContent('button.modifica');
    expect(secondFormButtons[1]).toHaveTextContent('button.elimina');
    expect(result?.container).toHaveTextContent('-');
  });

  it('changes a pec - new value valid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                senderName: 'Mocked Sender',
                pec: 'mocked@pec.it',
              }}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result?.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result?.getByTestId('specialContactForm');
    const firstFormButtons = specialContactForm!.querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    const input = await waitFor(() => specialContactForm!.querySelector('input'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    const newButtons = specialContactForm!.querySelectorAll('button');
    expect(newButtons!).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: 'new.long-pec-123@456.it' } });
    await waitFor(() => expect(input!).toHaveValue('new.long-pec-123@456.it'));
    expect(newButtons![0]).toBeEnabled();
    const inputError = result?.container.querySelector(`#mocked-senderId_pec-helper-text`);
    expect(inputError).not.toBeInTheDocument();
  });

  it('changes a pec - new value invalid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                senderName: 'Mocked Sender',
                pec: 'mocked@pec.it',
              }}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result?.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result?.getByTestId('specialContactForm');
    const firstFormButtons = specialContactForm!.querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    const input = await waitFor(() => specialContactForm!.querySelector('input'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    const newButtons = specialContactForm!.querySelectorAll('button');
    expect(newButtons!).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: 'new.bad.-pec-123@456.it' } });
    await waitFor(() => expect(input!).toHaveValue('new.bad.-pec-123@456.it'));
    expect(newButtons![0]).toBeDisabled();
    let inputError = result?.container.querySelector(`#mocked-senderId_pec-helper-text`);
    expect(inputError).toBeInTheDocument();
    expect(inputError).toHaveTextContent('legal-contacts.valid-pec');
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => expect(input!).toHaveValue(''));
    inputError = result?.container.querySelector(`#mocked-senderId_pec-helper-text`);
    expect(inputError).toHaveTextContent('legal-contacts.valid-pec');
  });

  it('changes a mail - new value valid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                senderName: 'Mocked Sender',
                mail: 'mocked@mail.it',
              }}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result?.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result?.getByTestId('specialContactForm');
    const firstFormButtons = specialContactForm!.querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    const input = await waitFor(() => specialContactForm!.querySelector('input'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@mail.it');
    const newButtons = specialContactForm!.querySelectorAll('button');
    expect(newButtons!).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: 'new.long-mail-123@456.it' } });
    await waitFor(() => expect(input!).toHaveValue('new.long-mail-123@456.it'));
    expect(newButtons![0]).toBeEnabled();
    const inputError = result?.container.querySelector(`#mocked-senderId_mail-helper-text`);
    expect(inputError).not.toBeInTheDocument();
  });

  it('changes a mail - new value invalid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                senderName: 'Mocked Sender',
                mail: 'mocked@mail.it',
              }}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result?.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result?.getByTestId('specialContactForm');
    const firstFormButtons = specialContactForm!.querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    const input = await waitFor(() => specialContactForm!.querySelector('input'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@mail.it');
    const newButtons = specialContactForm!.querySelectorAll('button');
    expect(newButtons!).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: 'new.bad.-mail-123@456.it' } });
    await waitFor(() => expect(input!).toHaveValue('new.bad.-mail-123@456.it'));
    expect(newButtons![0]).toBeDisabled();
    let inputError = result?.container.querySelector(`#mocked-senderId_mail-helper-text`);
    expect(inputError).toBeInTheDocument();
    expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => expect(input!).toHaveValue(''));
    inputError = result?.container.querySelector(`#mocked-senderId_mail-helper-text`);
    expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
  });

  it('changes a phone number - new value valid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                senderName: 'Mocked Sender',
                phone: '+39333333333',
              }}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result?.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result?.getByTestId('specialContactForm');
    const firstFormButtons = specialContactForm!.querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    const input = await waitFor(() => specialContactForm!.querySelector('input'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('+39333333333');
    const newButtons = specialContactForm!.querySelectorAll('button');
    expect(newButtons!).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: '+39333333334' } });
    await waitFor(() => expect(input!).toHaveValue('+39333333334'));
    expect(newButtons![0]).toBeEnabled();
    const inputError = result?.container.querySelector(`#mocked-senderId_phone-helper-text`);
    expect(inputError).not.toBeInTheDocument();
  });

  it('changes a phone number - new value invalid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                senderName: 'Mocked Sender',
                phone: '+39333333333',
              }}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result?.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result?.getByTestId('specialContactForm');
    const firstFormButtons = specialContactForm!.querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    const input = await waitFor(() => specialContactForm!.querySelector('input'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('+39333333333');
    const newButtons = specialContactForm!.querySelectorAll('button');
    expect(newButtons!).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: '123456789' } });
    await waitFor(() => expect(input!).toHaveValue('123456789'));
    expect(newButtons![0]).toBeDisabled();
    let inputError = result?.container.querySelector(`#mocked-senderId_phone-helper-text`);
    expect(inputError).toBeInTheDocument();
    expect(inputError).toHaveTextContent('courtesy-contacts.valid-phone');
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => expect(input!).toHaveValue(''));
    inputError = result?.container.querySelector(`#mocked-senderId_phone-helper-text`);
    expect(inputError).toHaveTextContent('courtesy-contacts.valid-phone');
  });

  it('Edits one contacts and checks that others are disabled', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                senderName: 'Mocked Sender',
                pec: 'mocked@pec.it',
                phone: '+39333333333',
              }}
              recipientId="mocked-recipientId"
            />
            <SpecialContactElem
              address={{
                senderId: 'another-mocked-senderId',
                senderName: 'Another mocked Sender',
                mail: 'mocked@mail.it',
                phone: '+39333333334',
              }}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });
    // edit the first contact of the first row
    const specialContactForms = result?.getAllByTestId('specialContactForm');
    let firstFormButtons = specialContactForms![0].querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    let input = await waitFor(() => specialContactForms![0].querySelector('input'));
    firstFormButtons = specialContactForms![0].querySelectorAll('button');
    expect(input).toBeInTheDocument();
    // check the disabled status of the others button
    const secondFormButtons = specialContactForms![1].querySelectorAll('button');
    for (const button of secondFormButtons) {
      expect(button).toBeDisabled();
    }
    const thirdFormButtons = specialContactForms![2].querySelectorAll('button');
    for (const button of thirdFormButtons) {
      expect(button).toBeDisabled();
    }
    const fourthFormButtons = specialContactForms![3].querySelectorAll('button');
    for (const button of fourthFormButtons) {
      expect(button).toBeDisabled();
    }
    // exit from edit
    fireEvent.click(firstFormButtons[1]);
    input = await waitFor(() => specialContactForms![0].querySelector('input'));
    expect(input).not.toBeInTheDocument();
    // check the disabled status of the others button
    for (const button of secondFormButtons) {
      expect(button).toBeEnabled();
    }
    for (const button of thirdFormButtons) {
      expect(button).toBeEnabled();
    }
    for (const button of fourthFormButtons) {
      expect(button).toBeEnabled();
    }
  });
});
