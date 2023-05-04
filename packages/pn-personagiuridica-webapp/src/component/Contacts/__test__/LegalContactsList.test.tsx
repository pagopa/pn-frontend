import React from 'react';
import * as redux from 'react-redux';
import { act, fireEvent, RenderResult, waitFor, screen } from '@testing-library/react';

import { render } from '../../../__test__/test-utils';
import { DigitalAddress, LegalChannelType } from '../../../models/contacts';
import * as actions from '../../../redux/contact/actions';
import LegalContactsList from '../LegalContactsList';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const legalAddresses: Array<DigitalAddress> = [
  {
    addressType: 'legal',
    recipientId: 'mocked-recipientId',
    senderId: 'default',
    channelType: LegalChannelType.PEC,
    value: 'mocked@mail.it',
    pecValid: true
  },
];

describe('LegalContactsList Component', () => {
  let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;
  let deleteMockActionFn: jest.Mock;

  beforeEach(async () => {
    // mock action
    mockActionFn = jest.fn();
    const actionSpy = jest.spyOn(actions, 'createOrUpdateLegalAddress');
    actionSpy.mockImplementation(mockActionFn as any);
    deleteMockActionFn = jest.fn();
    const deleteActionSpy = jest.spyOn(actions, 'deleteLegalAddress');
    deleteActionSpy.mockImplementation(deleteMockActionFn as any);
    // mock dispatch
    mockDispatchFn = jest.fn(() => ({
      unwrap: () => Promise.resolve(),
    }));
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <LegalContactsList recipientId="mocked-recipientId" legalAddresses={legalAddresses} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
  });

  afterEach(() => {
    result = undefined;
  });

  it('renders LegalContactsList', () => {
    expect(result?.container).toHaveTextContent('legal-contacts.title');
    expect(result?.container).toHaveTextContent('legal-contacts.subtitle-2');
    const form = result?.container.querySelector('form');
    expect(form!).toBeInTheDocument();
    expect(form!).toHaveTextContent('legal-contacts.pec-added');
    expect(form!).toHaveTextContent('mocked@mail.it');
    const buttons = form?.querySelectorAll('button');
    expect(buttons!).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('button.modifica');
    expect(buttons![1]).toHaveTextContent('button.elimina');
  });

  // it('expands disclosure', async () => {
  //   expect(result?.container).not.toHaveTextContent('legal-contacts.description-2');
  //   expect(result?.container).not.toHaveTextContent('legal-contacts.save-money');
  //   expect(result?.container).not.toHaveTextContent('legal-contacts.avoid-waste');
  //   const disclosureIcon = result?.queryByTestId('ErrorOutlineIcon');
  //   fireEvent.click(disclosureIcon!);
  //   await waitFor(() => {
  //     expect(result?.container).toHaveTextContent('legal-contacts.description-2');
  //     expect(result?.container).toHaveTextContent('legal-contacts.save-money');
  //     expect(result?.container).toHaveTextContent('legal-contacts.avoid-waste');
  //   });
  // });

  it('enables editing', async () => {
    const form = result?.container.querySelector('form');
    const buttons = form?.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const input = await waitFor(() => {
      expect(form!).not.toHaveTextContent('mocked@mail.it');
      return form?.querySelector('input');
    });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@mail.it');
    const newButtons = form?.querySelectorAll('button');
    expect(newButtons!).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
  });

  it('checks invalid pec - 1', async () => {
    const form = result?.container.querySelector('form');
    const buttons = form?.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const input = await waitFor(() => form?.querySelector('input'));
    fireEvent.change(input!, { target: { value: 'mail-errata' } });
    await waitFor(() => expect(input!).toHaveValue('mail-errata'));
    const errorMessage = form?.querySelector('#pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    const newButtons = form?.querySelectorAll('button');
    expect(newButtons![0]).toBeDisabled();
  });

  it('checks invalid pec - 2', async () => {
    const form = result?.container.querySelector('form');
    const buttons = form?.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const input = await waitFor(() => form?.querySelector('input'));
    fireEvent.change(input!, { target: { value: 'mail@invalida.informazionelunga' } });
    await waitFor(() => expect(input!).toHaveValue('mail@invalida.informazionelunga'));
    const errorMessage = form?.querySelector('#pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    const newButtons = form?.querySelectorAll('button');
    expect(newButtons![0]).toBeDisabled();
  });

  it('checks valid pec', async () => {
    const form = result?.container.querySelector('form');
    const buttons = form?.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const input = await waitFor(() => form?.querySelector('input'));
    fireEvent.change(input!, { target: { value: 'mail@valida.local' } });
    await waitFor(() => expect(input!).toHaveValue('mail@valida.local'));
    const errorMessage = form?.querySelector('#pec-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const newButtons = form?.querySelectorAll('button');
    expect(newButtons![0]).toBeEnabled();
  });

  it('edits pec', async () => {
    const form = result?.container.querySelector('form');
    const buttons = form?.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const input = await waitFor(() => form?.querySelector('input'));
    fireEvent.change(input!, { target: { value: 'mail@valida.com' } });
    await waitFor(() => expect(input!).toHaveValue('mail@valida.com'));
    const newButtons = form?.querySelectorAll('button');
    fireEvent.click(newButtons![0]);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        recipientId: 'mocked-recipientId',
        senderId: 'default',
        channelType: LegalChannelType.PEC,
        value: 'mail@valida.com',
        code: undefined,
      });
    });
    const dialog = await waitFor(() => {
      const dialogEl = screen.queryByTestId('codeDialog');
      expect(dialogEl).toBeInTheDocument();
      return dialogEl;
    });
    const codeInputs = dialog?.querySelectorAll('input');
    // fill inputs with values
    codeInputs?.forEach((codeInput, index) => {
      fireEvent.change(codeInput, { target: { value: index.toString() } });
    });
    const dialogButtons = dialog?.querySelectorAll('button');
    // clear mocks
    mockActionFn.mockClear();
    mockActionFn.mockReset();
    mockDispatchFn.mockReset();
    mockDispatchFn.mockClear();
    mockDispatchFn.mockImplementation(
      jest.fn(() => ({
        unwrap: () => Promise.resolve({ code: 'verified' }),
      }))
    );
    fireEvent.click(dialogButtons![2]);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        recipientId: 'mocked-recipientId',
        senderId: 'default',
        channelType: LegalChannelType.PEC,
        value: 'mail@valida.com',
        code: '01234',
      });
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
      expect(input).not.toBeInTheDocument();
      expect(form).toHaveTextContent('mail@valida.com');
    });
  });

  it('deletes pec', async () => {
    const form = result?.container.querySelector('form');
    const buttons = form?.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    const dialog = await waitFor(() => screen.queryByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    const dialogButtons = dialog?.querySelectorAll('button');
    fireEvent.click(dialogButtons![1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(deleteMockActionFn).toBeCalledTimes(1);
      expect(deleteMockActionFn).toBeCalledWith({
        recipientId: 'mocked-recipientId',
        senderId: 'default',
        channelType: LegalChannelType.PEC,
      });
    });
  });
});
