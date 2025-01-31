import { vi } from 'vitest';

import { getById, testRadio } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { ChannelType } from '../../../models/contacts';
import SercqSendCourtesyDialog from '../SercqSendCourtesyDialog';

const discardHandler = vi.fn();
const confirmHandler = vi.fn();

describe('test SercqSendCourtesyDialog', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('render component - no AppIO', async () => {
    // render component
    render(<SercqSendCourtesyDialog open onConfirm={confirmHandler} onDiscard={discardHandler} />);
    const dialog = screen.getByTestId('sercqSendCourtesyDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('legal-contacts.sercq-send-courtesy-title');
    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('legal-contacts.sercq-send-courtesy-description');
    const courtesyAddressRadio = within(bodyEl).getAllByTestId('courtesyAddressRadio');
    expect(courtesyAddressRadio).toHaveLength(2);
    expect(courtesyAddressRadio[0]).toHaveTextContent('courtesy-contacts.email-title');
    expect(courtesyAddressRadio[0]).toHaveTextContent('courtesy-contacts.email-dialog-description');
    expect(courtesyAddressRadio[1]).toHaveTextContent('courtesy-contacts.sms-title');
    expect(courtesyAddressRadio[1]).toHaveTextContent('courtesy-contacts.sms-dialog-description');
    const cancelButton = screen.getByText('button.not-now');
    expect(cancelButton).toBeInTheDocument();
    const confirmButton = await waitFor(() => screen.getByText('button.conferma'));
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });

  it('click on buttons', async () => {
    // render component
    render(<SercqSendCourtesyDialog open onConfirm={confirmHandler} onDiscard={discardHandler} />);
    const cancelButton = screen.getByText('button.not-now');
    fireEvent.click(cancelButton);
    expect(discardHandler).toHaveBeenCalledTimes(1);
    const confirmButton = screen.getByText('button.conferma');
    // select an option
    const dialog = screen.getByTestId('sercqSendCourtesyDialog');
    // email case
    await testRadio(
      dialog,
      'courtesyAddressRadio',
      ['courtesy-contacts.email-title', 'courtesy-contacts.sms-title'],
      0,
      true
    );
    // fill the input before with invalid value and after with valid one
    let input = getById(dialog, 'value');
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    await waitFor(() => expect(input).toHaveValue('invalid-email'));
    let errorMessage = dialog.querySelector(`#value-helper-text`);
    expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-email');
    expect(confirmButton).toBeDisabled();
    fireEvent.change(input, { target: { value: 'mail@valid.it' } });
    await waitFor(() => expect(input).toHaveValue('mail@valid.it'));
    expect(errorMessage).not.toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(confirmHandler).toHaveBeenCalledTimes(1);
      expect(confirmHandler).toHaveBeenCalledWith(ChannelType.EMAIL, 'mail@valid.it');
    });
    // sms case
    await testRadio(
      dialog,
      'courtesyAddressRadio',
      ['courtesy-contacts.email-title', 'courtesy-contacts.sms-title'],
      1,
      true
    );
    // fill the input before with invalid value and after with valid one
    input = getById(dialog, 'value');
    fireEvent.change(input, { target: { value: 'invalid-sms' } });
    await waitFor(() => expect(input).toHaveValue('invalid-sms'));
    errorMessage = dialog.querySelector(`#value-helper-text`);
    expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-sms');
    expect(confirmButton).toBeDisabled();
    fireEvent.change(input, { target: { value: '333333333' } });
    await waitFor(() => expect(input).toHaveValue('333333333'));
    expect(errorMessage).not.toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(confirmHandler).toHaveBeenCalledTimes(2);
      expect(confirmHandler).toHaveBeenCalledWith(ChannelType.SMS, '333333333');
    });
  });
});
