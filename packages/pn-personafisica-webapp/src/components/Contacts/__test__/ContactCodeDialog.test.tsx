import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen, within } from '../../../__test__/test-utils';
import { AddressType, ChannelType } from '../../../models/contacts';
import ContactCodeDialog from '../ContactCodeDialog';
import { fillCodeDialog } from './test-utils';

const discardHandler = vi.fn();
const confirmHandler = vi.fn();

describe('test ContactCodeDialog', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('render component - legal address', () => {
    // render component
    render(
      <ContactCodeDialog
        value="mocked@pec.it"
        addressType={AddressType.LEGAL}
        channelType={ChannelType.PEC}
        open
        onConfirm={confirmHandler}
        onDiscard={discardHandler}
      />
    );
    const dialog = screen.getByTestId('codeDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('legal-contacts.pec-verify');
    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('legal-contacts.pec-verify-descr');
    expect(bodyEl).toHaveTextContent('insert-code');
    expect(bodyEl).toHaveTextContent('legal-contacts.pec-new-code');
    const newCodeButton = within(bodyEl).getByTestId('newCodeBtn');
    expect(newCodeButton).toBeInTheDocument();
    const cancelButton = within(dialog).getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
    const confirmButton = within(dialog).getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
  });

  it('render component - courtesy address', () => {
    // render component
    render(
      <ContactCodeDialog
        value="mocked@mail.it"
        addressType={AddressType.COURTESY}
        channelType={ChannelType.EMAIL}
        open
        onConfirm={confirmHandler}
        onDiscard={discardHandler}
      />
    );
    const dialog = screen.getByTestId('codeDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('courtesy-contacts.email-verify');
    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('courtesy-contacts.email-verify-descr');
    expect(bodyEl).toHaveTextContent('insert-code');
    expect(bodyEl).toHaveTextContent('courtesy-contacts.email-new-code');
    const newCodeButton = within(bodyEl).getByTestId('newCodeBtn');
    expect(newCodeButton).toBeInTheDocument();
    const cancelButton = within(dialog).getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
    const confirmButton = within(dialog).getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
  });

  it('render component - onboarding email variant', () => {
    render(
      <ContactCodeDialog
        value="mocked@mail.it"
        addressType={AddressType.COURTESY}
        channelType={ChannelType.EMAIL}
        variant="onboarding-email"
        open
        onConfirm={confirmHandler}
        onDiscard={discardHandler}
      />
    );

    const dialog = screen.getByTestId('codeDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toHaveTextContent('onboarding.courtesy.email.verify-before-continue-title');

    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toHaveTextContent('onboarding.otp.description-email');
    expect(bodyEl).toHaveTextContent('onboarding.otp.validity');
    expect(bodyEl).toHaveTextContent('onboarding.otp.new-code-email');
    expect(within(dialog).getByText('onboarding.otp.confirm-label')).toBeInTheDocument();
  });

  it('render component - onboarding pec variant', () => {
    render(
      <ContactCodeDialog
        value="mocked@pec.it"
        addressType={AddressType.LEGAL}
        channelType={ChannelType.PEC}
        variant="onboarding-pec"
        open
        onConfirm={confirmHandler}
        onDiscard={discardHandler}
      />
    );

    const dialog = screen.getByTestId('codeDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toHaveTextContent(
      'onboarding.digital-domicile.pec.verify-before-continue-title'
    );

    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toHaveTextContent('onboarding.otp.description-pec');
    expect(bodyEl).toHaveTextContent('onboarding.otp.validity');
    expect(bodyEl).toHaveTextContent('onboarding.otp.new-code-pec');
    expect(within(dialog).getByText('onboarding.otp.confirm-label')).toBeInTheDocument();
  });

  it('falls back to the original copy when onboarding email variant is used with PEC channel', () => {
    render(
      <ContactCodeDialog
        value="mocked@pec.it"
        addressType={AddressType.LEGAL}
        channelType={ChannelType.PEC}
        variant="onboarding-email"
        open
        onConfirm={confirmHandler}
        onDiscard={discardHandler}
      />
    );

    const dialog = screen.getByTestId('codeDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toHaveTextContent('legal-contacts.pec-verify');

    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toHaveTextContent('legal-contacts.pec-verify-descr');
    expect(bodyEl).toHaveTextContent('legal-contacts.pec-new-code');
    expect(within(dialog).getByText('button.conferma')).toBeInTheDocument();
  });

  it('click on buttons', async () => {
    // render component
    const result = render(
      <ContactCodeDialog
        value="mocked@pec.it"
        addressType={AddressType.LEGAL}
        channelType={ChannelType.PEC}
        open
        onConfirm={confirmHandler}
        onDiscard={discardHandler}
      />
    );
    const cancelButton = screen.getByText('button.annulla');
    fireEvent.click(cancelButton);
    expect(discardHandler).toHaveBeenCalledTimes(1);
    const newCodeButton = screen.getByTestId('newCodeBtn');
    fireEvent.click(newCodeButton);
    expect(confirmHandler).toHaveBeenCalledTimes(1);
    expect(confirmHandler).toHaveBeenCalledWith();
    // fill code input
    await fillCodeDialog(result);
    expect(confirmHandler).toHaveBeenCalledTimes(2);
    expect(confirmHandler).toHaveBeenCalledWith('01234');
  });
});
