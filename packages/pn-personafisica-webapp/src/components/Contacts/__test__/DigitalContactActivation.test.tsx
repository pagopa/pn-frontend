import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalAddressesSercq, digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType, IOAllowedValues } from '../../../models/contacts';
import { RECAPITI } from '../../../navigation/routes.const';
import DigitalContactActivation from '../DigitalContactActivation';

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
    expect(mockNavigateFn).toHaveBeenCalledWith(-1);
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

    const howItWorksContinueButton = getByTestId('continueButton');
    fireEvent.click(howItWorksContinueButton);

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

  it('does render the second and third step labels if has no courtesy contacts', () => {
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

  it('does render the third step label if has an active email address', () => {
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
    expect(step3Label).toBeInTheDocument();
  });

  it('does render the third step label if has an active phone address', () => {
    const { queryByText } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.SMS,
              value: '+39333123456',
            },
          ],
        },
      },
    });
    const step3Label = queryByText('legal-contacts.sercq-send-wizard.step_3.step-title');
    expect(step3Label).toBeInTheDocument();
  });

  // TODO: fix and restore the following test once IO step has been refactored
  it.skip('shows the confirmation modals trying to skip App IO', async () => {
    // uncomment the following snippet to mock sercq activation api call once the final step is created
    // mock
    //   .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
    //     value: SERCQ_SEND_VALUE,
    //   })
    //   .reply(204);
    // mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(false, false));
    // mock
    //   .onPut(
    //     '/bff/v2/tos-privacy',
    //     acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
    //   )
    //   .reply(200);

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
    const howItWorksContinueButton = getByTestId('continueButton');
    fireEvent.click(howItWorksContinueButton);

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
      'legal-contacts.sercq-send-wizard.feedback.go-to-contacts'
    );
    fireEvent.click(feedbackButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(RECAPITI);
  });

  it('adds an email correctly', async () => {
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
    // uncomment the following snippet to mock sercq activation api call once the final step is created
    // mock
    //   .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
    //     value: SERCQ_SEND_VALUE,
    //   })
    //   .reply(204);
    // mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(false, false));
    // mock
    //   .onPut(
    //     '/bff/v2/tos-privacy',
    //     acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
    //   )
    //   .reply(200);

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
    const howItWorksContinueButton = result.getByTestId('continueButton');
    fireEvent.click(howItWorksContinueButton);

    let confirmButton = result.getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();

    // // insert new email
    // const form = result.container.querySelector('form');
    // const input = form!.querySelector(`[name="default_email"]`);
    // fireEvent.change(input!, { target: { value: mailValue } });
    // await waitFor(() => expect(input).toHaveValue(mailValue));
    // const button = result.getByTestId('default_email-button');
    // fireEvent.click(button);

    // // inser otp and confirm
    // const dialog = await fillCodeDialog(result);

    // // check that contact has been added
    // await waitFor(() => expect(dialog).not.toBeInTheDocument());
    // const emailValue = getById(form!, 'default_email-typography');
    // expect(emailValue).toBeInTheDocument();
    // expect(emailValue).toHaveTextContent(mailValue);

    // confirmButton = result.getByText('button.conferma');
    // expect(confirmButton).toBeInTheDocument();

    // this test should fail here after enforcing email/sms as mandatory field to continue
    // verify the confirmation modal is shown and uncomment the commented lines above (happy path)
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
      'legal-contacts.sercq-send-wizard.feedback.go-to-contacts'
    );
    fireEvent.click(feedbackButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(RECAPITI);
  });

  it('renders component correctly when transferring', async () => {
    // uncomment the following snippet to mock sercq activation api call once the final step is created
    // mock
    //   .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
    //     value: SERCQ_SEND_VALUE,
    //   })
    //   .reply(204);
    // mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, sercqSendTosPrivacyConsentMock(false, false));
    // mock
    //   .onPut(
    //     '/bff/v2/tos-privacy',
    //     acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
    //   )
    //   .reply(200);

    const { getByTestId, queryByTestId, getByText } = render(
      <DigitalContactActivation isTransferring />,
      {
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
      }
    );

    const pecSection = queryByTestId('pec-contact-wizard');
    expect(pecSection).not.toBeInTheDocument();

    const wizardTitle = getByTestId('wizard-title');
    expect(wizardTitle).toHaveTextContent('legal-contacts.sercq-send-wizard.title-transfer');

    const howItWorksContinueButton = getByTestId('continueButton');
    fireEvent.click(howItWorksContinueButton);

    const confirmButton = getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);

    const feedbackStep = getByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();

    const feedbackTitle = getByTestId('wizard-feedback-title');
    expect(feedbackTitle).toHaveTextContent(
      'legal-contacts.sercq-send-wizard.feedback.title-transfer'
    );
  });
});
