import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalAddressesSercq, digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import { NOTIFICHE } from '../../../navigation/routes.const';
import DigitalContactActivation from '../DigitalContactActivation';
import { fillCodeDialog } from './test-utils';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('DigitalContactActivation', () => {
  const labelPrefix = 'legal-contacts.sercq-send-wizard';
  let mock: MockAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render component', () => {
    const { getByText } = render(<DigitalContactActivation />);
    const title = getByText(`${labelPrefix}.title`);
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

  it('renders the first and second step labels correctly', () => {
    const { getByTestId } = render(<DigitalContactActivation />);
    const stepper = getByTestId('desktopWizardStepper');
    expect(stepper).toBeInTheDocument();
    const step1Label = within(stepper).getByText(`${labelPrefix}.step_1.title`);
    expect(step1Label).toBeInTheDocument();
    const step2Label = within(stepper).getByText(`${labelPrefix}.step_2.step-title`);
    expect(step2Label).toBeInTheDocument();
    const sercqSendContent = getByTestId('sercqSendContactWizard');
    expect(sercqSendContent).toBeInTheDocument();
  });

  it('does not render the second step label if already has an email address', async () => {
    const { getByTestId } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.EMAIL,
              value: 'mock@test.it',
            },
          ],
        },
      },
    });

    const stepper = getByTestId('desktopWizardStepper');
    expect(stepper).toBeInTheDocument();
    const step1Label = within(stepper).getByText(`${labelPrefix}.step_1.title`);
    expect(step1Label).toBeInTheDocument();
    const step2Label = within(stepper).queryByText(`${labelPrefix}.step_2.step-title`);
    expect(step2Label).toBeInTheDocument();
  });

  it('renders the feedback step correctly', async () => {
    // uncomment the following snippet to mock sercq activation api call once the final step is created
    // mock.
    //   onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
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

    const { getByTestId, getByText } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.EMAIL,
              value: 'mock@test.it',
            },
          ],
        },
      },
    });
    const howItWorksContinueButton = getByTestId('continueButton');
    fireEvent.click(howItWorksContinueButton);

    const confirmButton = getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);

    const feedbackStep = getByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();

    const feedbackTitle = getByTestId('wizard-feedback-title');
    expect(feedbackTitle).toHaveTextContent(`${labelPrefix}.feedback.title-sercq_send-activation`);

    const feedbackContent = getByTestId('wizard-feedback-content');
    expect(feedbackContent).toHaveTextContent(`${labelPrefix}.feedback.content-sercq_send`);

    const feedbackButton = getByTestId('wizard-feedback-button');
    expect(feedbackButton).toHaveTextContent('button.understand');
    fireEvent.click(feedbackButton);

    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(NOTIFICHE);
  });

  it('adds an email correctly', async () => {
    // uncomment the following snippet to mock sercq activation api call once the final step is created
    // use the following commented code once the recap step is created to mock sercq activation api call
    // mock.
    //   onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
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

    const result = render(<DigitalContactActivation />);
    const howItWorksContinueButton = result.getByTestId('continueButton');
    fireEvent.click(howItWorksContinueButton);

    let confirmButton = result.getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();

    fireEvent.click(confirmButton);

    const confirmationDialog = result.getByRole('dialog');

    expect(confirmationDialog).toBeInTheDocument();
    within(confirmationDialog).getByText('courtesy-contacts.confirmation-modal-title');
    within(confirmationDialog).getByText('courtesy-contacts.confirmation-modal-content');

    const dismissButton = result.getByRole('button', { name: 'button.understand' });

    fireEvent.click(dismissButton);

    await waitFor(() => {
      expect(confirmationDialog).not.toBeInTheDocument();
    });

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

    confirmButton = result.getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();

    fireEvent.click(confirmButton);

    // thankyou page
    const feedbackStep = result.getByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();

    const feedbackTitle = result.getByTestId('wizard-feedback-title');
    expect(feedbackTitle).toHaveTextContent(`${labelPrefix}.feedback.title-sercq_send-activation`);

    const feedbackContent = result.getByTestId('wizard-feedback-content');
    expect(feedbackContent).toHaveTextContent(`${labelPrefix}.feedback.content-sercq_send`);
    const feedbackButton = result.getByTestId('wizard-feedback-button');
    expect(feedbackButton).toHaveTextContent('button.understand');

    fireEvent.click(feedbackButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(NOTIFICHE);
  });

  it('renders component correctly when transferring', async () => {
    // uncomment the following snippet to mock sercq activation api call once the final step is created
    // use the following commented code once the recap step is created to mock sercq activation api call
    // mock.
    //   onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
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
            ],
          },
        },
      }
    );

    const pecSection = queryByTestId('pec-contact-wizard');
    expect(pecSection).not.toBeInTheDocument();

    const wizardTitle = getByTestId('wizard-title');
    expect(wizardTitle).toHaveTextContent(`${labelPrefix}.title-transfer`);

    const howItWorksContinueButton = getByTestId('continueButton');
    fireEvent.click(howItWorksContinueButton);

    const confirmButton = getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);

    // Thank-you page
    const feedbackStep = getByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();

    const feedbackTitle = getByTestId('wizard-feedback-title');
    expect(feedbackTitle).toHaveTextContent(`${labelPrefix}.feedback.title-sercq_send-transfer`);

    const feedbackContent = getByTestId('wizard-feedback-content');
    expect(feedbackContent).toHaveTextContent(`${labelPrefix}.feedback.content-sercq_send`);
  });
});
