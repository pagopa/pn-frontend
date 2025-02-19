import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { ConsentType, SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';
import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import {
  acceptTosPrivacyConsentBodyMock,
  sercqSendTosPrivacyConsentMock,
} from '../../../__mocks__/Consents.mock';
import { digitalAddressesSercq, digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType, IOAllowedValues } from '../../../models/contacts';
import DigitalContactActivation from '../DigitalContactActivation';
import { fillCodeDialog } from './test-utils';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('DigitalContactActivation', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render component', () => {
    const { getByText } = render(<DigitalContactActivation />);
    const title = getByText('legal-contacts.sercq-send-wizard.title');
    expect(title).toBeInTheDocument();
  });

  it('should go back when clicking on the back button', () => {
    const { getByText } = render(<DigitalContactActivation />);
    const backButton = getByText('button.annulla');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
  });

  it('renders pec contact wizard correctly', () => {
    const { getByTestId } = render(<DigitalContactActivation />);
    const pecSection = getByTestId('pec-section');
    expect(pecSection).toBeInTheDocument();
    const pecButton = within(pecSection).getByRole('button');
    fireEvent.click(pecButton);
    const pecWizard = getByTestId('pec-contact-wizard');
    expect(pecWizard).toBeInTheDocument();
  });

  it('renders pec contact wizard if SERCQ SEND is already enabled', () => {
    const { getByTestId } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddressesSercq.filter(
            (addr) => addr.channelType === ChannelType.SERCQ_SEND
          ),
        },
      },
    });
    const pecSection = getByTestId('pec-contact-wizard');
    expect(pecSection).toBeInTheDocument();
  });

  it('renders the first step label correctly', () => {
    const { getByTestId } = render(<DigitalContactActivation />);
    const stepper = getByTestId('desktopWizardStepper');
    expect(stepper).toBeInTheDocument();
    const step1Label = within(stepper).getByText('legal-contacts.sercq-send-wizard.step_1.title');
    expect(step1Label).toBeInTheDocument();
    const sercqSendContent = getByTestId('sercqSendContactWizard');
    expect(sercqSendContent).toBeInTheDocument();
  });

  it('renders the second step label if has appIO and is disabled', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(false, false));
    mock
      .onPut(
        '/bff/v2/tos-privacy',
        acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
      )
      .reply(200);

    const { getByTestId } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.DISABLED,
            },
          ],
        },
      },
    });
    const stepper = getByTestId('desktopWizardStepper');
    expect(stepper).toBeInTheDocument();
    const step2Label = within(stepper).getByText('legal-contacts.sercq-send-wizard.step_2.title');
    expect(step2Label).toBeInTheDocument();

    const activateSercqSendButton = getByTestId('activateButton');
    fireEvent.click(activateSercqSendButton);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

    const ioContactWizard = getByTestId('ioContactWizard');
    expect(ioContactWizard).toBeInTheDocument();
  });

  it('does not render the second step label if has no app IO contact', () => {
    const { queryByText } = render(<DigitalContactActivation />);
    const step2Label = queryByText('legal-contacts.sercq-send-wizard.step_2.title');
    expect(step2Label).not.toBeInTheDocument();
  });

  it('does not render the second step label if has app IO enabled', () => {
    const { queryByText } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.ENABLED,
            },
          ],
        },
      },
    });
    const step2Label = queryByText('legal-contacts.sercq-send-wizard.step_2.title');
    expect(step2Label).not.toBeInTheDocument();
  });

  it('renders the second and third step labels if has no courtesy contacts', () => {
    const { queryByText } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.DISABLED,
            },
          ],
        },
      },
    });
    const step2Label = queryByText('legal-contacts.sercq-send-wizard.step_2.title');
    expect(step2Label).toBeInTheDocument();
    const step3Label = queryByText('legal-contacts.sercq-send-wizard.step_3.step-title');
    expect(step3Label).toBeInTheDocument();
  });

  it('does not render the third step label if has an active email address', () => {
    const { queryByText } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.EMAIL,
              value: 'mock@mail.com',
            },
          ],
        },
      },
    });
    const step3Label = queryByText('legal-contacts.sercq-send-wizard.step_3.step-title');
    expect(step3Label).not.toBeInTheDocument();
  });

  it('shows the confirmation modals trying to skip AppIO and email activation', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(false, false));
    mock
      .onPut(
        '/bff/v2/tos-privacy',
        acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
      )
      .reply(200);

    const { getByRole, getByTestId, getByText } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.DISABLED,
            },
          ],
        },
      },
    });
    const activateSercqSendButton = getByTestId('activateButton');
    fireEvent.click(activateSercqSendButton);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

    // IO Step
    const ioSkipButton = getByRole('button', { name: 'button.not-now' });
    fireEvent.click(ioSkipButton);

    let dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    getByText('courtesy-contacts.confirmation-modal-title');
    getByText('courtesy-contacts.confirmation-modal-io-content');
    getByText('courtesy-contacts.confirmation-modal-io-accept');
    const ioConfirmSkipButton = getByText('button.do-later');

    fireEvent.click(ioConfirmSkipButton);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });

    // Email Step
    getByText('legal-contacts.sercq-send-wizard.step_3.title');
    const mailSkipButton = getByRole('button', { name: 'button.not-now' });
    fireEvent.click(mailSkipButton);

    dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    getByText('courtesy-contacts.confirmation-modal-title');
    getByText('courtesy-contacts.confirmation-modal-email-content');
    getByText('courtesy-contacts.confirmation-modal-email-accept');
    const mailConfirmSkipButton = getByText('button.do-later');

    fireEvent.click(mailConfirmSkipButton);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });

    // Thank-you page
    const feedbackStep = getByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();

    const feedbackTitle = getByTestId('wizard-feedback-title');
    expect(feedbackTitle).toHaveTextContent(
      'legal-contacts.sercq-send-wizard.feedback.title-activation'
    );
    const feedbackButton = getByTestId('wizard-feedback-button');
    expect(feedbackButton).toHaveTextContent(
      'legal-contacts.sercq-send-wizard.feedback.back-to-contacts'
    );
    fireEvent.click(feedbackButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
  });

  it('adds an email correctly (verify skip and confirm buttons)', async () => {
    const mailValue = 'nome.utente@mail.it';
    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: mailValue }).reply(200, {
      result: 'CODE_VERIFICATION_REQUIRED',
    });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
        value: mailValue,
        verificationCode: '01234',
      })
      .reply(204);

    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(false, false));
    mock
      .onPut(
        '/bff/v2/tos-privacy',
        acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
      )
      .reply(200);

    const result = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.ENABLED,
            },
          ],
        },
      },
    });
    const activateSercqSendButton = result.getByTestId('activateButton');
    fireEvent.click(activateSercqSendButton);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

    expect(result.getByText('button.not-now')).toBeInTheDocument();
    expect(result.queryByText('button.conferma')).not.toBeInTheDocument();

    // insert new email
    const form = result.container.querySelector('form');
    const input = form!.querySelector(`[name="default_email"]`);
    fireEvent.change(input!, { target: { value: mailValue } });
    await waitFor(() => expect(input).toHaveValue(mailValue));
    const button = result.getByTestId('default_email-button');
    fireEvent.click(button);

    // inser otp and confirm
    const dialog = await fillCodeDialog(result);

    // check that contact has been added
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    const emailValue = getById(form!, 'default_email-typography');
    expect(emailValue).toBeInTheDocument();
    expect(emailValue).toHaveTextContent(mailValue);

    const confirmButton = result.getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(result.queryByText('button.not-now')).not.toBeInTheDocument();
    fireEvent.click(confirmButton);

    // thankyou page
    const feedbackStep = result.getByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();

    const feedbackTitle = result.getByTestId('wizard-feedback-title');
    expect(feedbackTitle).toHaveTextContent(
      'legal-contacts.sercq-send-wizard.feedback.title-activation'
    );
    const feedbackButton = result.getByTestId('wizard-feedback-button');
    expect(feedbackButton).toHaveTextContent(
      'legal-contacts.sercq-send-wizard.feedback.back-to-contacts'
    );
    fireEvent.click(feedbackButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
  });

  it('renders component correctly when transferring', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(false, false));
    mock
      .onPut(
        '/bff/v2/tos-privacy',
        acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
      )
      .reply(200);

    const { getByTestId, queryByTestId } = render(<DigitalContactActivation isTransferring />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            ...digitalLegalAddresses,
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.EMAIL,
              value: 'nome.utente@mail.it',
            },
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.ENABLED,
            },
          ],
        },
      },
    });

    const pecSection = queryByTestId('pec-contact-wizard');
    expect(pecSection).not.toBeInTheDocument();

    const wizardTitle = getByTestId('wizard-title');
    expect(wizardTitle).toHaveTextContent('legal-contacts.sercq-send-wizard.title-transfer');

    const activateSercqSendButton = getByTestId('activateButton');
    fireEvent.click(activateSercqSendButton);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

    const feedbackStep = getByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();

    const feedbackTitle = getByTestId('wizard-feedback-title');
    expect(feedbackTitle).toHaveTextContent(
      'legal-contacts.sercq-send-wizard.feedback.title-transfer'
    );
  });
});
