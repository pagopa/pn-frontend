import * as redux from 'react-redux';
import { act, fireEvent, RenderResult, waitFor, screen } from '@testing-library/react';

import { axe, render } from '../../../__test__/test-utils';
import * as actions from '../../../redux/contact/actions';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import InsertLegalContact from '../InsertLegalContact';
import { LegalChannelType } from '../../../models/contacts';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('InsertLegalContact component', () => {
  let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;

  beforeEach(async () => {
    // mock action
    mockActionFn = jest.fn();
    const actionSpy = jest.spyOn(actions, 'createOrUpdateLegalAddress');
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
          <InsertLegalContact recipientId={'mocked-recipientId'} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
  });

  afterEach(() => {
    result = undefined;
  });

  it('renders InsertLegalContact', () => {
    const cardBody = result?.queryByTestId('DigitalContactsCardBody');
    expect(cardBody).toHaveTextContent('legal-contacts.title');
    expect(cardBody).toHaveTextContent('legal-contacts.subtitle');
    expect(cardBody).toHaveTextContent('legal-contacts.description');
    const disclaimerList = cardBody?.querySelector('ul');
    expect(disclaimerList!).toHaveTextContent('legal-contacts.save-money');
    expect(disclaimerList!).toHaveTextContent('legal-contacts.avoid-waste');
    expect(disclaimerList!).toHaveTextContent('legal-contacts.fast-notification');
    const radioButtons = cardBody?.querySelectorAll('[data-testid="digitalDomicileTypeRadio"]');
    expect(radioButtons).toHaveLength(2);
    expect(radioButtons![0]).toHaveTextContent('legal-contacts.link-pec');
    const radioInput = radioButtons![0].querySelector('input');
    expect(radioInput!).toBeChecked();
    expect(radioButtons![1]).toHaveTextContent('legal-contacts.link-io');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    expect(pecInput!).toHaveValue('');
    const cardActions = result?.queryByTestId('DigitalContactsCardActions');
    expect(cardActions).toHaveTextContent('button.associa');
    const button = cardActions?.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('checks invalid pec', async () => {
    const cardBody = result?.queryByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, { target: { value: 'mail-errata' } });
    await waitFor(() => expect(pecInput!).toHaveValue('mail-errata'));
    const errorMessage = cardBody?.querySelector('#pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    const cardActions = result?.queryByTestId('DigitalContactsCardActions');
    expect(cardActions).toHaveTextContent('button.associa');
    const button = cardActions?.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('checks valid pec', async () => {
    const cardBody = result?.queryByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, { target: { value: 'mail@valida.mail' } });
    await waitFor(() => expect(pecInput!).toHaveValue('mail@valida.mail'));
    const errorMessage = cardBody?.querySelector('#pec-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const cardActions = result?.queryByTestId('DigitalContactsCardActions');
    expect(cardActions).toHaveTextContent('button.associa');
    const button = cardActions?.querySelector('button');
    expect(button).toBeEnabled();
  });

  it('adds pec', async () => {
    const cardBody = result?.queryByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, { target: { value: 'mail@valida.mail' } });
    await waitFor(() => expect(pecInput!).toHaveValue('mail@valida.mail'));
    const cardActions = result?.queryByTestId('DigitalContactsCardActions');
    const button = cardActions?.querySelector('button');
    fireEvent.click(button!);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        recipientId: 'mocked-recipientId',
        senderId: 'default',
        channelType: LegalChannelType.PEC,
        value: 'mail@valida.mail',
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
        unwrap: () => Promise.resolve({ code: '01234' }),
      }))
    );
    fireEvent.click(dialogButtons![1]);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        recipientId: 'mocked-recipientId',
        senderId: 'default',
        channelType: LegalChannelType.PEC,
        value: 'mail@valida.mail',
        code: '01234',
      });
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('does not have basic accessibility issues', async () => {
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 10000);
});
