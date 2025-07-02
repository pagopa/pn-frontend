import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { ConsentType, SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import {
  acceptTosPrivacyConsentBodyMock,
  sercqSendTosPrivacyConsentMock,
} from '../../../__mocks__/Consents.mock';
import { digitalAddressesSercq, digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import { RECAPITI } from '../../../navigation/routes.const';
import DigitalContactActivation from '../DigitalContactActivation';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('DigitalContactActivation', () => {
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

  it('renders the first and second step labels correctly', () => {
    const { getByTestId } = render(<DigitalContactActivation />);
    const stepper = getByTestId('desktopWizardStepper');
    expect(stepper).toBeInTheDocument();
    const step1Label = within(stepper).getByText('legal-contacts.sercq-send-wizard.step_1.title');
    expect(step1Label).toBeInTheDocument();
    const step2Label = within(stepper).getByText(
      'legal-contacts.sercq-send-wizard.step_2.step-title'
    );
    expect(step2Label).toBeInTheDocument();
    const sercqSendContent = getByTestId('sercqSendContactWizard');
    expect(sercqSendContent).toBeInTheDocument();
  });

  it('does render the second step label if already has an email address', async () => {
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
              channelType: ChannelType.EMAIL,
              value: 'mock@test.it',
            },
          ],
        },
      },
    });

    const stepper = getByTestId('desktopWizardStepper');
    expect(stepper).toBeInTheDocument();
    const step1Label = within(stepper).getByText('legal-contacts.sercq-send-wizard.step_1.title');
    expect(step1Label).toBeInTheDocument();
    const step2Label = within(stepper).queryByText(
      'legal-contacts.sercq-send-wizard.step_2.step-title'
    );
    expect(step2Label).toBeInTheDocument();
  });

  it('renders the feedback step correctly', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock
      .onGet(/\/bff\/v1\/pg\/tos-privacy.*/)
      .reply(200, sercqSendTosPrivacyConsentMock(false, false));
    mock
      .onPut(
        '/bff/v1/pg/tos-privacy',
        acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
      )
      .reply(200);

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
    const activateSercqSendButton = getByTestId('activateButton');
    fireEvent.click(activateSercqSendButton);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

    const confirmButton = getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);

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

    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock
      .onGet(/\/bff\/v1\/pg\/tos-privacy.*/)
      .reply(200, sercqSendTosPrivacyConsentMock(false, false));
    mock
      .onPut(
        '/bff/v1/pg/tos-privacy',
        acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
      )
      .reply(200);

    const result = render(<DigitalContactActivation />);
    const activateSercqSendButton = result.getByTestId('activateButton');
    fireEvent.click(activateSercqSendButton);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

    let confirmButton = result.getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();

    // insert new email
    // const form = result.container.querySelector('form');
    // const input = form!.querySelector(`[name="default_email"]`);
    // fireEvent.change(input!, { target: { value: mailValue } });
    // await waitFor(() => expect(input).toHaveValue(mailValue));
    // const button = result.getByTestId('default_email-button');
    // fireEvent.click(button);

    // // inser otp and confirm
    // dialog = await fillCodeDialog(result);

    // // check that contact has been added
    // await waitFor(() => expect(dialog).not.toBeInTheDocument());
    // const emailValue = getById(form!, 'default_email-typography');
    // expect(emailValue).toBeInTheDocument();
    // expect(emailValue).toHaveTextContent(mailValue);

    // const confirmButton = result.getByText('button.conferma');
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
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ_SEND', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    mock
      .onGet(/\/bff\/v1\/pg\/tos-privacy.*/)
      .reply(200, sercqSendTosPrivacyConsentMock(false, false));
    mock
      .onPut(
        '/bff/v1/pg/tos-privacy',
        acceptTosPrivacyConsentBodyMock(ConsentType.TOS_SERCQ, ConsentType.DATAPRIVACY_SERCQ)
      )
      .reply(200);

    const { getByTestId, queryByTestId, getByText } = render(
      <DigitalContactActivation isTransferring />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: digitalLegalAddresses,
          },
        },
      }
    );

    const pecSection = queryByTestId('pec-contact-wizard');
    expect(pecSection).not.toBeInTheDocument();

    const wizardTitle = getByTestId('wizard-title');
    expect(wizardTitle).toHaveTextContent('legal-contacts.sercq-send-wizard.title-transfer');

    const activateSercqSendButton = getByTestId('activateButton');
    fireEvent.click(activateSercqSendButton);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

    const confirmButton = getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);

    // Thank-you page
    const feedbackStep = getByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();

    const feedbackTitle = getByTestId('wizard-feedback-title');
    expect(feedbackTitle).toHaveTextContent(
      'legal-contacts.sercq-send-wizard.feedback.title-transfer'
    );
  });
});
