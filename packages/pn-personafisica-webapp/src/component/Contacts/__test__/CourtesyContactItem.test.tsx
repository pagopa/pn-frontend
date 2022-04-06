/* eslint-disable functional/no-let */
import { act, fireEvent, render, RenderResult, screen, waitFor } from "@testing-library/react";
import * as redux from 'react-redux';
import { CourtesyChannelType } from "../../../models/contacts";
import * as actions from '../../../redux/contact/actions';
import * as hooks from '../../../redux/hooks';
import CourtesyContactItem, { CourtesyFieldType } from "../CourtesyContactItem";
import { DigitalContactsCodeVerificationProvider } from "../DigitalContactsCodeVerification.context";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
      t: (str: string) => str,
    }),
    Trans: () => "mocked verify description",
}));

describe('CourtesyContactItem component', () => {
  let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;
  
  describe('testing component having type "phone"', () => {

    beforeEach(async () => {
      const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
      mockUseAppSelector.mockReturnValue('mocked-recipientId');
      // // mock app selector
      // appSelectorSpy = jest.spyOn(hooks, 'useAppSelector');
      // mock action
      mockActionFn = jest.fn();
      const actionSpy = jest.spyOn(actions, 'createOrUpdateCourtesyAddress');
      actionSpy.mockImplementation(mockActionFn as any);
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
            <CourtesyContactItem type={CourtesyFieldType.PHONE} value="" isVerified={false} />
          </DigitalContactsCodeVerificationProvider>
        );
      });
    });

    test('entering an invalid phone number', async () => {
      const inputs = await result!.findAllByRole('textbox');
      expect(inputs![0]).toBeInTheDocument();
      expect(inputs).toHaveLength(1);
      const input = result?.getByPlaceholderText('courtesy-contacts.link-phone-placeholder');
      expect(inputs![0]).toEqual(input);
      fireEvent.change(input!, { target: { value: '484893' } });
      await waitFor(() => expect(input!).toHaveValue('484893'));
      const textMessage = result!.queryByText('courtesy-contacts.valid-phone');
      expect(textMessage).toBeInTheDocument();
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('courtesy-contacts.phone-add');
      expect(button).toBeDisabled();
      
    });

    test('entering a valid phone number', async() => {
      const input = result?.getByRole('textbox');
      expect(input).toHaveValue('');
      fireEvent.change(input!, { target: { value: '3331234567' } });
      await waitFor(() => expect(input!).toHaveValue('3331234567'));
      const textMessage = result!.queryByText('courtesy-contacts.valid-phone');
      expect(textMessage).not.toBeInTheDocument();
      const buttons = result!.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent('courtesy-contacts.phone-add');
      expect(buttons[0]).toBeEnabled();
    });

    test('adding a new phone number', async () => {
      const input = result?.getByRole('textbox');
      fireEvent.change(input!, { target: { value: '3331234567' } });
      await waitFor(() => expect(input!).toHaveValue('3331234567'));
      const button = result!.getByRole('button');
      fireEvent.click(button!);
      await waitFor(() => {
        expect(mockDispatchFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledWith({
          recipientId: 'mocked-recipientId',
          senderId: 'default',
          channelType: CourtesyChannelType.SMS,
          value: '3331234567',
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
      mockDispatchFn.mockImplementation(jest.fn(() => ({
        unwrap: () => Promise.resolve({code: '01234'}),
      })));
      fireEvent.click(dialogButtons![1]);
      await waitFor(() => {
        expect(mockDispatchFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledWith({
          recipientId: 'mocked-recipientId',
          senderId: 'default',
          channelType: CourtesyChannelType.SMS,
          value: '3331234567',
          code: '01234',
        });
      });
      await waitFor(() => {
        expect(dialog).not.toBeInTheDocument();
      });
    });
  });

  describe('testing component having type "email"', () => {

    beforeEach(async () => {
      const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
      mockUseAppSelector.mockReturnValue('mocked-recipientId');
      // // mock app selector
      // appSelectorSpy = jest.spyOn(hooks, 'useAppSelector');
      // mock action
      mockActionFn = jest.fn();
      const actionSpy = jest.spyOn(actions, 'createOrUpdateCourtesyAddress');
      actionSpy.mockImplementation(mockActionFn as any);
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
            <CourtesyContactItem type={CourtesyFieldType.EMAIL} value="" isVerified={false} />
          </DigitalContactsCodeVerificationProvider>
        );
      });
    });

    test('entering an invalid emaill', async () => {
      const inputs = await result!.findAllByRole('textbox');
      expect(inputs![0]).toBeInTheDocument();
      expect(inputs).toHaveLength(1);
      const input = result?.getByPlaceholderText('courtesy-contacts.link-email-placeholder');
      expect(inputs![0]).toEqual(input);
      fireEvent.change(input!, { target: { value: 'provapagopa.it' } });
      await waitFor(() => expect(input!).toHaveValue('provapagopa.it'));
      const textMessage = result!.queryByText('courtesy-contacts.valid-email');
      expect(textMessage).toBeInTheDocument();
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('courtesy-contacts.email-add');
      expect(button).toBeDisabled();
      
    });

    test('entering a valid email', async() => {
      const input = result?.getByRole('textbox');
      expect(input).toHaveValue('');
      fireEvent.change(input!, { target: { value: 'prova@pagopa.it' } });
      await waitFor(() => expect(input!).toHaveValue('prova@pagopa.it'));
      const textMessage = result!.queryByText('courtesy-contacts.valid-email');
      expect(textMessage).not.toBeInTheDocument();
      const buttons = result!.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent('courtesy-contacts.email-add');
      expect(buttons[0]).toBeEnabled();
    });

    test('adding a new email', async () => {
      const input = result?.getByRole('textbox');
      fireEvent.change(input!, { target: { value: 'prova@pagopa.it' } });
      await waitFor(() => expect(input!).toHaveValue('prova@pagopa.it'));
      const button = result!.getByRole('button');
      fireEvent.click(button!);
      await waitFor(() => {
        expect(mockDispatchFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledWith({
          recipientId: 'mocked-recipientId',
          senderId: 'default',
          channelType: CourtesyChannelType.EMAIL,
          value: 'prova@pagopa.it',
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
      mockDispatchFn.mockImplementation(jest.fn(() => ({
        unwrap: () => Promise.resolve({code: '01234'}),
      })));
      fireEvent.click(dialogButtons![1]);
      await waitFor(() => {
        expect(mockDispatchFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledWith({
          recipientId: 'mocked-recipientId',
          senderId: 'default',
          channelType: CourtesyChannelType.EMAIL,
          value: 'prova@pagopa.it',
          code: '01234',
        });
      });
      await waitFor(() => {
        expect(dialog).not.toBeInTheDocument();
      });
    });
  });
});