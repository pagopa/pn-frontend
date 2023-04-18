/* eslint-disable functional/no-let */
import React from 'react';

import { act, fireEvent, RenderResult, screen, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import { render, axe } from '../../../__test__/test-utils';
import { CourtesyChannelType } from '../../../models/contacts';
import * as hooks from '../../../redux/hooks';
import * as actions from '../../../redux/contact/actions';
import CourtesyContactItem, { CourtesyFieldType } from '../CourtesyContactItem';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked verify description',
}));

const emptyMockedStore = {
  legal: [],
  courtesy: [],
};

describe('CourtesyContactItem component', () => {
  let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;
  let deleteMockActionFn: jest.Mock;

  beforeEach(() => {
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValue(emptyMockedStore);
  });

  describe('test component having type "phone"', () => {
    const INPUT_VALID_PHONE = '3331234567';
    const INPUT_VALID_PHONE_2 = '3337654321';
    const SUBMITTED_VALID_PHONE = '+393331234567';
    const INPUT_INVALID_PHONE = '33312345';
    const INPUT_VALID_PHONE_UPDATE = '+393331234567';
    const INPUT_VALID_PHONE_2_UPDATE = '+393337654321';
    const INPUT_INVALID_PHONE_UPDATE = '+3933312345';
    const VALID_CODE = 'verified';

    beforeEach(() => {
      mockActionFn = jest.fn();
      const actionSpy = jest.spyOn(actions, 'createOrUpdateCourtesyAddress');
      actionSpy.mockImplementation(mockActionFn as any);

      mockDispatchFn = jest.fn(() => ({
        unwrap: () => Promise.resolve(),
      }));
      const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    });

    describe('add a new phone number', () => {
      beforeEach(async () => {
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
      });

      test('type in an invalid number', async () => {
        const inputs = await result!.findAllByRole('textbox');
        expect(inputs![0]).toBeInTheDocument();
        expect(inputs).toHaveLength(1);
        const input = result?.getByPlaceholderText('courtesy-contacts.link-phone-placeholder');
        expect(inputs![0]).toEqual(input);
        fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
        await waitFor(() => expect(input!).toHaveValue(INPUT_INVALID_PHONE));
        const textMessage = result!.queryByText('courtesy-contacts.valid-phone');
        expect(textMessage).toBeInTheDocument();
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('courtesy-contacts.phone-add');
        expect(button).toBeDisabled();
      });

      test('type in a valid number', async () => {
        const input = result?.getByRole('textbox');
        expect(input).toHaveValue('');
        fireEvent.change(input!, { target: { value: INPUT_VALID_PHONE } });
        await waitFor(() => expect(input!).toHaveValue(INPUT_VALID_PHONE));
        const textMessage = result!.queryByText('courtesy-contacts.valid-phone');
        expect(textMessage).not.toBeInTheDocument();
        const buttons = result!.getAllByRole('button');
        expect(buttons).toHaveLength(1);
        expect(buttons[0]).toHaveTextContent('courtesy-contacts.phone-add');
        expect(buttons[0]).toBeEnabled();
      });

      test('save a new phone number', async () => {
        const input = result?.getByRole('textbox');
        fireEvent.change(input!, { target: { value: INPUT_VALID_PHONE } });
        await waitFor(() => expect(input!).toHaveValue(INPUT_VALID_PHONE));
        const button = result!.getByRole('button');
        await waitFor(() => fireEvent.click(button!));
        // Confirms the disclaimer dialog
        const disclaimerCheckbox = screen.getByRole('checkbox', { name: 'button.capito' });
        fireEvent.click(disclaimerCheckbox);
        const disclaimerConfirmButton = screen.getByRole('button', { name: 'button.conferma' });
        fireEvent.click(disclaimerConfirmButton);

        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.SMS,
            value: SUBMITTED_VALID_PHONE,
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
            unwrap: () => Promise.resolve({ code: VALID_CODE }),
          }))
        );
        fireEvent.click(dialogButtons![2]);
        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.SMS,
            value: SUBMITTED_VALID_PHONE,
            code: '01234',
          });
        });
        await waitFor(() => {
          expect(dialog).not.toBeInTheDocument();
        });
      });
    });

    describe('change an existing phone number', () => {
      beforeEach(async () => {
        await act(async () => {
          result = render(
            <DigitalContactsCodeVerificationProvider>
              <CourtesyContactItem
                recipientId="mocked-recipient"
                type={CourtesyFieldType.PHONE}
                value={INPUT_VALID_PHONE_UPDATE}
              />
            </DigitalContactsCodeVerificationProvider>
          );
        });
      });

      test('type in an invalid number while in "edit mode"', async () => {
        //verify initial conditions
        screen.getByText(INPUT_VALID_PHONE_UPDATE);
        screen.getByRole('button', { name: 'button.elimina' });
        const editButton = screen.getByRole('button', { name: 'button.modifica' });

        fireEvent.click(editButton);

        const input = screen.getByRole('textbox');
        const saveButton = screen.getByRole('button', { name: 'button.salva' });
        expect(input).toHaveValue(INPUT_VALID_PHONE_UPDATE);
        expect(saveButton).toBeEnabled();

        fireEvent.change(input, { target: { value: INPUT_INVALID_PHONE_UPDATE } });
        await waitFor(() => expect(input).toHaveValue(INPUT_INVALID_PHONE_UPDATE));
        expect(saveButton).toBeDisabled();
      });

      test('override an existing phone number using the same value', async () => {
        const editButton = screen.getByRole('button', { name: 'button.modifica' });
        fireEvent.click(editButton);
        const input = await waitFor(() => screen.getByRole('textbox'));
        const cancel = screen.getByRole('button', { name: 'button.annulla' });
        fireEvent.change(input, { target: { value: '' } });
        await waitFor(() => expect(input).toHaveValue(''));
        fireEvent.change(input, { target: { value: 'ciao' } });
        await waitFor(() => expect(input).toHaveValue('ciao'));
        fireEvent.click(cancel);
        await waitFor(() => {
          const number = screen.getByText(INPUT_VALID_PHONE_UPDATE);
          expect(number).toBeInTheDocument();
        });
        fireEvent.click(editButton);
        const saveButton = screen.getByRole('button', { name: 'button.salva' });

        fireEvent.change(input, { target: { value: '' } });
        await waitFor(() => expect(input).toHaveValue(''));
        fireEvent.change(input, { target: { value: INPUT_VALID_PHONE_UPDATE } });
        await waitFor(() => expect(input).toHaveValue(INPUT_VALID_PHONE_UPDATE));
        // clear mocks
        mockActionFn.mockClear();
        mockActionFn.mockReset();
        mockDispatchFn.mockReset();
        mockDispatchFn.mockClear();
        mockDispatchFn.mockImplementation(
          jest.fn(() => ({
            unwrap: () => Promise.resolve({ code: VALID_CODE }),
          }))
        );
        fireEvent.click(saveButton);
        // Confirms the disclaimer dialog
        const disclaimerCheckbox = screen.getByRole('checkbox', { name: 'button.capito' });
        fireEvent.click(disclaimerCheckbox);
        const disclaimerConfirmButton = screen.getByRole('button', { name: 'button.conferma' });
        fireEvent.click(disclaimerConfirmButton);
        await waitFor(() => screen.getByText(INPUT_VALID_PHONE_UPDATE));
      });

      test('override an existing phone number with a new one', async () => {
        const editButton = screen.getByRole('button', { name: 'button.modifica' });
        fireEvent.click(editButton);
        const input = result?.getByRole('textbox');
        fireEvent.change(input!, { target: { value: INPUT_VALID_PHONE_2_UPDATE } });
        await waitFor(() => expect(input!).toHaveValue(INPUT_VALID_PHONE_2_UPDATE));
        const saveButton = screen.getByRole('button', { name: 'button.salva' });
        fireEvent.click(saveButton);
        // Confirms the disclaimer dialog
        const disclaimerCheckbox = screen.getByRole('checkbox', { name: 'button.capito' });
        fireEvent.click(disclaimerCheckbox);
        const disclaimerConfirmButton = screen.getByRole('button', { name: 'button.conferma' });
        fireEvent.click(disclaimerConfirmButton);
        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.SMS,
            value: INPUT_VALID_PHONE_2_UPDATE,
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
            unwrap: () => Promise.resolve({ code: VALID_CODE }),
          }))
        );
        fireEvent.click(dialogButtons![2]);
        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.SMS,
            value: INPUT_VALID_PHONE_2_UPDATE,
            code: '01234',
          });
        });
        await waitFor(() => {
          expect(dialog).not.toBeInTheDocument();
        });
      });

      /* test('override an existing email using the same value', async () => {
        const editButton = screen.getByRole('button', { name: 'button.modifica' });
        fireEvent.click(editButton);
        const input = await waitFor(() => screen.getByRole('textbox'));
        const cancel = screen.getByRole('button', { name: 'button.annulla' });
        fireEvent.change(input, { target: { value: '' } });
        await waitFor(() => expect(input).toHaveValue(''));
        fireEvent.change(input, { target: { value: 'ciao' } });
        await waitFor(() => expect(input).toHaveValue('ciao'));
        fireEvent.click(cancel);
        await waitFor(() => {
          const number = screen.getByText(INPUT_VALID_PHONE);
          expect(number).toBeInTheDocument();
        });
      }) */
    });

    describe('delete an existing phone number', () => {
      beforeEach(async () => {
        deleteMockActionFn = jest.fn();
        const deleteActionSpy = jest.spyOn(actions, 'deleteCourtesyAddress');
        deleteActionSpy.mockImplementation(deleteMockActionFn as any);

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
      });

      test('delete phone number', async () => {
        const phoneText = screen.getByText(SUBMITTED_VALID_PHONE);
        expect(phoneText).toBeInTheDocument();

        const deleteButton = screen.getByRole('button', { name: 'button.elimina' });

        fireEvent.click(deleteButton);

        // find confirmation dialog and its buttons
        const dialogBox = screen.getByRole('dialog', { name: /courtesy-contacts.remove\b/ });
        expect(dialogBox).toBeVisible();
        const cancelButton = screen.getByRole('button', { name: 'button.annulla' });
        const confirmButton = screen.getByRole('button', { name: 'button.conferma' });

        // cancel delete and verify the dialog hides and the value is still on the page
        fireEvent.click(cancelButton);
        expect(dialogBox).not.toBeVisible();

        // delete the number
        fireEvent.click(deleteButton);
        expect(dialogBox).toBeVisible();

        fireEvent.click(confirmButton);
        await waitFor(() => {
          expect(dialogBox).not.toBeVisible();
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(deleteMockActionFn).toBeCalledTimes(1);
          expect(deleteMockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.SMS,
          });
        });
      });
    });
  });

  describe('testing component having type "email"', () => {
    const VALID_EMAIL = 'prova@pagopa.it';
    const VALID_EMAIL_2 = 'test-pagopa@gmail.inner.it';
    const INVALID_EMAIL_1 = 'testpagopa.it';
    const INVALID_EMAIL_2 = 'a1.a2.a3.a4.a5.a6.a7.a8.a9.a0.b1.b2@pagopa.it';
    const VALID_CODE = 'verified';

    beforeEach(() => {
      mockActionFn = jest.fn();
      const actionSpy = jest.spyOn(actions, 'createOrUpdateCourtesyAddress');
      actionSpy.mockImplementation(mockActionFn as any);

      mockDispatchFn = jest.fn(() => ({
        unwrap: () => Promise.resolve(),
      }));
      const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    });

    describe('add a new email', () => {
      beforeEach(async () => {
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
      });

      test('type in an invalid email - 1', async () => {
        const inputs = await result!.findAllByRole('textbox');
        expect(inputs![0]).toBeInTheDocument();
        expect(inputs).toHaveLength(1);
        const input = result?.getByPlaceholderText('courtesy-contacts.link-email-placeholder');
        expect(inputs![0]).toEqual(input);
        fireEvent.change(input!, { target: { value: INVALID_EMAIL_1 } });
        await waitFor(() => expect(input!).toHaveValue(INVALID_EMAIL_1));
        const textMessage = result!.queryByText('courtesy-contacts.valid-email');
        expect(textMessage).toBeInTheDocument();
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('courtesy-contacts.email-add');
        expect(button).toBeDisabled();
      });

      test('type in an invalid email - 2', async () => {
        const inputs = await result!.findAllByRole('textbox');
        expect(inputs![0]).toBeInTheDocument();
        expect(inputs).toHaveLength(1);
        const input = result?.getByPlaceholderText('courtesy-contacts.link-email-placeholder');
        expect(inputs![0]).toEqual(input);
        fireEvent.change(input!, { target: { value: INVALID_EMAIL_2 } });
        await waitFor(() => expect(input!).toHaveValue(INVALID_EMAIL_2));
        const textMessage = result!.queryByText('courtesy-contacts.valid-email');
        expect(textMessage).toBeInTheDocument();
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('courtesy-contacts.email-add');
        expect(button).toBeDisabled();
      });

      test('type in a valid email', async () => {
        const input = result?.getByRole('textbox');
        expect(input).toHaveValue('');
        fireEvent.change(input!, { target: { value: VALID_EMAIL } });
        await waitFor(() => expect(input!).toHaveValue(VALID_EMAIL));
        const textMessage = result!.queryByText('courtesy-contacts.valid-email');
        expect(textMessage).not.toBeInTheDocument();
        const buttons = result!.getAllByRole('button');
        expect(buttons).toHaveLength(1);
        expect(buttons[0]).toHaveTextContent('courtesy-contacts.email-add');
        expect(buttons[0]).toBeEnabled();
      });

      test('add a new email', async () => {
        const input = result?.getByRole('textbox');
        fireEvent.change(input!, { target: { value: VALID_EMAIL } });
        await waitFor(() => expect(input!).toHaveValue(VALID_EMAIL));
        const button = result!.getByRole('button');
        await waitFor(() => fireEvent.click(button!));
        // Confirms the disclaimer dialog
        const disclaimerCheckbox = screen.getByRole('checkbox', { name: 'button.capito' });
        fireEvent.click(disclaimerCheckbox);
        const disclaimerConfirmButton = screen.getByRole('button', { name: 'button.conferma' });
        fireEvent.click(disclaimerConfirmButton);

        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.EMAIL,
            value: VALID_EMAIL,
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
            unwrap: () => Promise.resolve({ code: VALID_CODE }),
          }))
        );
        fireEvent.click(dialogButtons![2]);
        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.EMAIL,
            value: VALID_EMAIL,
            code: '01234',
          });
        });
        await waitFor(() => {
          expect(dialog).not.toBeInTheDocument();
        });
      });
    });

    describe('modify an existing email', () => {
      beforeEach(async () => {
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
      });

      test('type in an invalid email while in "edit mode"', async () => {
        //verify initial conditions
        screen.getByText(VALID_EMAIL);
        screen.getByRole('button', { name: 'button.elimina' });
        const editButton = screen.getByRole('button', { name: 'button.modifica' });

        fireEvent.click(editButton);

        const input = screen.getByRole('textbox');
        const saveButton = screen.getByRole('button', { name: 'button.salva' });
        expect(input).toHaveValue(VALID_EMAIL);
        expect(saveButton).toBeEnabled();

        fireEvent.change(input, { target: { value: INVALID_EMAIL_1 } });
        await waitFor(() => expect(input).toHaveValue(INVALID_EMAIL_1));
        expect(saveButton).toBeDisabled();
      });

      test('override an existing email using the same value', async () => {
        const editButton = screen.getByRole('button', { name: 'button.modifica' });
        fireEvent.click(editButton);
        const input = await waitFor(() => screen.getByRole('textbox'));
        const cancel = screen.getByRole('button', { name: 'button.annulla' });
        fireEvent.change(input, { target: { value: '' } });
        await waitFor(() => expect(input).toHaveValue(''));
        fireEvent.change(input, { target: { value: 'ciao' } });
        await waitFor(() => expect(input).toHaveValue('ciao'));
        fireEvent.click(cancel);
        await waitFor(() => {
          const number = screen.getByText(VALID_EMAIL);
          expect(number).toBeInTheDocument();
        });
        fireEvent.click(editButton);
        const saveButton = screen.getByRole('button', { name: 'button.salva' });
        fireEvent.change(input, { target: { value: '' } });
        await waitFor(() => expect(input).toHaveValue(''));
        fireEvent.change(input, { target: { value: VALID_EMAIL } });
        await waitFor(() => expect(input).toHaveValue(VALID_EMAIL));
        // clear mocks
        mockActionFn.mockClear();
        mockActionFn.mockReset();
        mockDispatchFn.mockReset();
        mockDispatchFn.mockClear();
        mockDispatchFn.mockImplementation(
          jest.fn(() => ({
            unwrap: () => Promise.resolve({ code: VALID_CODE }),
          }))
        );
        await waitFor(() => fireEvent.click(saveButton));
        // Confirms the disclaimer dialog
        const disclaimerCheckbox = screen.getByRole('checkbox', { name: 'button.capito' });
        fireEvent.click(disclaimerCheckbox);
        const disclaimerConfirmButton = screen.getByRole('button', { name: 'button.conferma' });
        fireEvent.click(disclaimerConfirmButton);
        
        await waitFor(() => screen.getByText(VALID_EMAIL));
      });

      test('override an existing email with a new one', async () => {
        const editButton = screen.getByRole('button', { name: 'button.modifica' });

        fireEvent.click(editButton);

        const input = result?.getByRole('textbox');
        fireEvent.change(input!, { target: { value: VALID_EMAIL_2 } });
        await waitFor(() => expect(input!).toHaveValue(VALID_EMAIL_2));
        const saveButton = screen.getByRole('button', { name: 'button.salva' });
        fireEvent.click(saveButton!);
        // Confirms the disclaimer dialog
        const disclaimerCheckbox = screen.getByRole('checkbox', { name: 'button.capito' });
        fireEvent.click(disclaimerCheckbox);
        const disclaimerConfirmButton = screen.getByRole('button', { name: 'button.conferma' });
        fireEvent.click(disclaimerConfirmButton);
        
        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.EMAIL,
            value: VALID_EMAIL_2,
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
            unwrap: () => Promise.resolve({ code: VALID_CODE }),
          }))
        );
        fireEvent.click(dialogButtons![2]);
        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.EMAIL,
            value: VALID_EMAIL_2,
            code: '01234',
          });
        });
        await waitFor(() => {
          expect(dialog).not.toBeInTheDocument();
        });
      });
    });

    describe('delete an existing email', () => {
      beforeEach(async () => {
        deleteMockActionFn = jest.fn();
        const deleteActionSpy = jest.spyOn(actions, 'deleteCourtesyAddress');
        deleteActionSpy.mockImplementation(deleteMockActionFn as any);

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
      });

      test('delete email', async () => {
        const textValue = screen.getByText(VALID_EMAIL);
        expect(textValue).toBeInTheDocument();

        const deleteButton = screen.getByRole('button', { name: 'button.elimina' });

        fireEvent.click(deleteButton);

        // find confirmation dialog and its buttons
        const dialogBox = screen.getByRole('dialog', { name: /courtesy-contacts.remove\b/ });
        expect(dialogBox).toBeVisible();
        const cancelButton = screen.getByRole('button', { name: 'button.annulla' });
        const confirmButton = screen.getByRole('button', { name: 'button.conferma' });

        // cancel delete and verify the dialog hides and the value is still on the page
        fireEvent.click(cancelButton);
        expect(dialogBox).not.toBeVisible();

        // delete the number
        fireEvent.click(deleteButton);
        expect(dialogBox).toBeVisible();

        fireEvent.click(confirmButton);
        await waitFor(() => {
          expect(dialogBox).not.toBeVisible();
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(deleteMockActionFn).toBeCalledTimes(1);
          expect(deleteMockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.EMAIL,
          });
        });
      });
    });
  });
});
