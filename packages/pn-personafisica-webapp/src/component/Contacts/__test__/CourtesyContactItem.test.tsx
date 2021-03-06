/* eslint-disable functional/no-let */
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
    const VALID_PHONE_NOPREFIX = '3331234567';
    const VALID_PHONE = '+393331234567';
    const VALID_PHONE_2 = '+393337654321';
    const INVALID_PHONE = '33312345';
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
        fireEvent.change(input!, { target: { value: INVALID_PHONE } });
        await waitFor(() => expect(input!).toHaveValue(INVALID_PHONE));
        const textMessage = result!.queryByText('courtesy-contacts.valid-phone');
        expect(textMessage).toBeInTheDocument();
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('courtesy-contacts.phone-add');
        expect(button).toBeDisabled();
      });

      test('type in a valid number', async () => {
        const input = result?.getByRole('textbox');
        expect(input).toHaveValue('');
        fireEvent.change(input!, { target: { value: VALID_PHONE } });
        await waitFor(() => expect(input!).toHaveValue(VALID_PHONE));
        const textMessage = result!.queryByText('courtesy-contacts.valid-phone');
        expect(textMessage).not.toBeInTheDocument();
        const buttons = result!.getAllByRole('button');
        expect(buttons).toHaveLength(1);
        expect(buttons[0]).toHaveTextContent('courtesy-contacts.phone-add');
        expect(buttons[0]).toBeEnabled();
      });

      test('save a new phone number', async () => {
        const input = result?.getByRole('textbox');
        fireEvent.change(input!, { target: { value: VALID_PHONE_NOPREFIX } });
        await waitFor(() => expect(input!).toHaveValue(VALID_PHONE_NOPREFIX));
        const button = result!.getByRole('button');
        fireEvent.click(button!);
        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.SMS,
            value: VALID_PHONE,
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
        fireEvent.click(dialogButtons![1]);
        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.SMS,
            value: VALID_PHONE,
            code: '01234',
          });
        });
        await waitFor(() => {
          expect(dialog).not.toBeInTheDocument();
        });
      });

      it('does not have basic accessibility issues', async () => {
        if (result) {
          const results = await axe(result.container);
          expect(results).toHaveNoViolations();
        }
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
                value={VALID_PHONE}
              />
            </DigitalContactsCodeVerificationProvider>
          );
        });
      });

      test('type in an invalid number while in "edit mode"', async () => {
        //verify initial conditions
        screen.getByText(VALID_PHONE);
        screen.getByRole('button', { name: 'button.rimuovi' });
        const editButton = screen.getByRole('button', { name: 'button.modifica' });

        fireEvent.click(editButton);

        const input = screen.getByRole('textbox');
        const saveButton = screen.getByRole('button', { name: 'button.salva' });
        expect(input).toHaveValue(VALID_PHONE);
        expect(saveButton).toBeEnabled();

        fireEvent.change(input, { target: { value: INVALID_PHONE } });
        await waitFor(() => expect(input).toHaveValue(INVALID_PHONE));
        expect(saveButton).toBeDisabled();
      });

      test('override an existing phone number using the same value', async () => {
        const editButton = screen.getByRole('button', { name: 'button.modifica' });
        fireEvent.click(editButton);
        const input = await waitFor(() => screen.getByRole('textbox'));
        const saveButton = screen.getByRole('button', { name: 'button.salva' });
        fireEvent.change(input, { target: { value: '' } });
        await waitFor(() => expect(input).toHaveValue(''));
        fireEvent.change(input, { target: { value: VALID_PHONE } });
        await waitFor(() => expect(input).toHaveValue(VALID_PHONE));
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
        await waitFor(() => screen.getByText(VALID_PHONE));
      });

      test('override an existing phone number with a new one', async () => {
        const editButton = screen.getByRole('button', { name: 'button.modifica' });
        fireEvent.click(editButton);
        const input = result?.getByRole('textbox');
        fireEvent.change(input!, { target: { value: VALID_PHONE_2 } });
        await waitFor(() => expect(input!).toHaveValue(VALID_PHONE_2));
        const saveButton = screen.getByRole('button', { name: 'button.salva' });
        fireEvent.click(saveButton);
        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.SMS,
            value: VALID_PHONE_2,
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
        fireEvent.click(dialogButtons![1]);
        await waitFor(() => {
          expect(mockDispatchFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledTimes(1);
          expect(mockActionFn).toBeCalledWith({
            recipientId: 'mocked-recipient',
            senderId: 'default',
            channelType: CourtesyChannelType.SMS,
            value: VALID_PHONE_2,
            code: '01234',
          });
        });
        await waitFor(() => {
          expect(dialog).not.toBeInTheDocument();
        });
      });

      it('does not have basic accessibility issues', async () => {
        if (result) {
          const results = await axe(result.container);
          expect(results).toHaveNoViolations();
        }
      });
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
                value={VALID_PHONE}
              />
            </DigitalContactsCodeVerificationProvider>
          );
        });
      });

      test('delete phone number', async () => {
        const phoneText = screen.getByText(VALID_PHONE);
        expect(phoneText).toBeInTheDocument();

        const deleteButton = screen.getByRole('button', { name: 'button.rimuovi' });

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

    it('does not have basic accessibility issues', async () => {
      if (result) {
        const results = await axe(result.container);
        expect(results).toHaveNoViolations();
      }
    });
  });

  describe('testing component having type "email"', () => {
    const VALID_EMAIL = 'prova@pagopa.it';
    const VALID_EMAIL_2 = 'testpagopa@gmail.it';
    const INVALID_EMAIL = 'testpagopa.it';
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

      test('type in an invalid email', async () => {
        const inputs = await result!.findAllByRole('textbox');
        expect(inputs![0]).toBeInTheDocument();
        expect(inputs).toHaveLength(1);
        const input = result?.getByPlaceholderText('courtesy-contacts.link-email-placeholder');
        expect(inputs![0]).toEqual(input);
        fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
        await waitFor(() => expect(input!).toHaveValue(INVALID_EMAIL));
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
        fireEvent.click(button!);
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
        fireEvent.click(dialogButtons![1]);
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

      it('does not have basic accessibility issues', async () => {
        if (result) {
          const results = await axe(result.container);
          expect(results).toHaveNoViolations();
        }
      });
    });

    describe('change an existing email', () => {
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
        screen.getByRole('button', { name: 'button.rimuovi' });
        const editButton = screen.getByRole('button', { name: 'button.modifica' });

        fireEvent.click(editButton);

        const input = screen.getByRole('textbox');
        const saveButton = screen.getByRole('button', { name: 'button.salva' });
        expect(input).toHaveValue(VALID_EMAIL);
        expect(saveButton).toBeEnabled();

        fireEvent.change(input, { target: { value: INVALID_EMAIL } });
        await waitFor(() => expect(input).toHaveValue(INVALID_EMAIL));
        expect(saveButton).toBeDisabled();
      });

      test('override an existing email using the same value', async () => {
        const editButton = screen.getByRole('button', { name: 'button.modifica' });
        fireEvent.click(editButton);
        const input = await waitFor(() => screen.getByRole('textbox'));
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
        fireEvent.click(saveButton);
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
        fireEvent.click(dialogButtons![1]);
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

      it('does not have basic accessibility issues', async () => {
        if (result) {
          const results = await axe(result.container);
          expect(results).toHaveNoViolations();
        }
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

        const deleteButton = screen.getByRole('button', { name: 'button.rimuovi' });

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
