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
import { ChannelType } from '../../../models/contacts';
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

  it('renders the first step label correctly', () => {
    const { getByTestId } = render(<DigitalContactActivation />);
    const stepper = getByTestId('desktopWizardStepper');
    expect(stepper).toBeInTheDocument();
    const step1Label = within(stepper).getByText('legal-contacts.sercq-send-wizard.step_1.title');
    expect(step1Label).toBeInTheDocument();
    const sercqSendContent = getByTestId('sercqSendContactWizard');
    expect(sercqSendContent).toBeInTheDocument();
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

    const { getByTestId } = render(<DigitalContactActivation />);
    const activateSercqSendButton = getByTestId('activateButton');
    fireEvent.click(activateSercqSendButton);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

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
    expect(mockNavigateFn).toHaveBeenCalledWith(-1);
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

    const { getByTestId, queryByTestId } = render(<DigitalContactActivation isTransferring />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalLegalAddresses,
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
