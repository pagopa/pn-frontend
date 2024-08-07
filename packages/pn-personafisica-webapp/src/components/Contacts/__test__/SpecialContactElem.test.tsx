import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { SpecialContactsProvider } from '@pagopa-pn/pn-commons';

import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import SpecialContactElem from '../SpecialContactElem';

vi.mock('react-i18next', () => ({
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
  let result: RenderResult;
  let mock: MockAdapter;

  const pecAddress = {
    addressType: AddressType.LEGAL,
    senderId: 'mocked-senderId',
    senderName: 'Mocked Sender',
    channelType: ChannelType.PEC,
    value: 'mocked@pec.it',
  };

  const emailAddress = {
    addressType: AddressType.COURTESY,
    senderId: 'mocked-senderId',
    senderName: 'Mocked Sender',
    channelType: ChannelType.EMAIL,
    value: 'mocked@mail.it',
  };

  const phoneAddress = {
    addressType: AddressType.COURTESY,
    senderId: 'mocked-senderId',
    senderName: 'Mocked Sender',
    channelType: ChannelType.SMS,
    value: '+39333333333',
  };

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders SpecialContactElem', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem addresses={[pecAddress, emailAddress]} />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result.container).toHaveTextContent('Mocked Sender');
    const specialContactForms = result.getAllByTestId('specialContactForm');
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
    expect(result.container).toHaveTextContent('-');
  });

  it('changes a pec - new value valid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem addresses={[pecAddress]} />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result.getByTestId('specialContactForm');
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
    const inputError = result.container.querySelector(`#mocked-senderId_pec-helper-text`);
    expect(inputError).not.toBeInTheDocument();
  });

  it('changes a pec - new value invalid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem addresses={[pecAddress]} />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result.getByTestId('specialContactForm');
    const firstFormButtons = specialContactForm!.querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    const input = await waitFor(() => specialContactForm!.querySelector('input'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    const newButtons = specialContactForm!.querySelectorAll('button');
    expect(newButtons!).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: 'new.bad.-pec-123]@456.it' } });
    await waitFor(() => expect(input!).toHaveValue('new.bad.-pec-123]@456.it'));
    expect(newButtons![0]).toBeDisabled();
    let inputError = result.container.querySelector(`#mocked-senderId_pec-helper-text`);
    expect(inputError).toBeInTheDocument();
    expect(inputError).toHaveTextContent('legal-contacts.valid-pec');
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => expect(input!).toHaveValue(''));
    inputError = result.container.querySelector(`#mocked-senderId_pec-helper-text`);
    expect(inputError).toHaveTextContent('legal-contacts.valid-pec');
  });

  it('changes a mail - new value valid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem addresses={[emailAddress]} />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result.getByTestId('specialContactForm');
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
    const inputError = result.container.querySelector(`#mocked-senderId_mail-helper-text`);
    expect(inputError).not.toBeInTheDocument();
  });

  it('changes a mail - new value invalid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem addresses={[emailAddress]} />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result.getByTestId('specialContactForm');
    const firstFormButtons = specialContactForm!.querySelectorAll('button');
    fireEvent.click(firstFormButtons[0]);
    const input = await waitFor(() => specialContactForm!.querySelector('input'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@mail.it');
    const newButtons = specialContactForm!.querySelectorAll('button');
    expect(newButtons!).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: 'new.bad.-mail-123]@456.it' } });
    await waitFor(() => expect(input!).toHaveValue('new.bad.-mail-123]@456.it'));
    expect(newButtons![0]).toBeDisabled();
    let inputError = result.container.querySelector(`#mocked-senderId_email-helper-text`);
    expect(inputError).toBeInTheDocument();
    expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => expect(input!).toHaveValue(''));
    inputError = result.container.querySelector(`#mocked-senderId_email-helper-text`);
    expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
  });

  it('changes a phone number - new value valid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem addresses={[phoneAddress]} />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result.getByTestId('specialContactForm');
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
    const inputError = result.container.querySelector(`#mocked-senderId_sms-helper-text`);
    expect(inputError).not.toBeInTheDocument();
  });

  it('changes a phone number - new value invalid', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem addresses={[phoneAddress]} />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(result.container).toHaveTextContent('Mocked Sender');
    const specialContactForm = result.getByTestId('specialContactForm');
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
    let inputError = result.container.querySelector(`#mocked-senderId_sms-helper-text`);
    expect(inputError).toBeInTheDocument();
    expect(inputError).toHaveTextContent('courtesy-contacts.valid-sms');
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => expect(input!).toHaveValue(''));
    inputError = result.container.querySelector(`#mocked-senderId_sms-helper-text`);
    expect(inputError).toHaveTextContent('courtesy-contacts.valid-sms');
  });

  it('Edits one contacts and checks that others are disabled', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem addresses={[pecAddress, phoneAddress]} />
            <SpecialContactElem
              addresses={[
                {
                  addressType: AddressType.COURTESY,
                  senderId: 'another-mocked-senderId',
                  senderName: 'Another mocked Sender',
                  channelType: ChannelType.EMAIL,
                  value: 'mocked@mail.it',
                },
                {
                  addressType: AddressType.COURTESY,
                  senderId: 'another-mocked-senderId',
                  senderName: 'Another mocked Sender',
                  channelType: ChannelType.SMS,
                  value: '+39333333334',
                },
              ]}
            />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });
    // edit the first contact of the first row
    const specialContactForms = result.getAllByTestId('specialContactForm');
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
  it('remove contact', async () => {
    mock.onDelete('/bff/v1/addresses/LEGAL/mocked-senderId/PEC').reply(204);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem addresses={[pecAddress]} />
          </SpecialContactsProvider>
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    // click on cancel
    fireEvent.click(buttons![1]);
    let dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    let dialogButtons = dialog?.querySelectorAll('button');
    // cancel remove operation
    fireEvent.click(dialogButtons![0]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    // click on confirm
    fireEvent.click(buttons![1]);
    dialog = await waitFor(() => screen.getByRole('dialog'));
    dialogButtons = dialog?.querySelectorAll('button');
    fireEvent.click(dialogButtons![1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });
  });
});
