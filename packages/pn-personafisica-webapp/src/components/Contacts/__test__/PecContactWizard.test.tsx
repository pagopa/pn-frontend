import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { ChannelType } from '../../../models/contacts';
import * as routes from '../../../navigation/routes.const';
import PecContactWizard from '../PecContactWizard';
import { fillCodeDialog } from './test-utils';

let setShowPecWizardMock: ReturnType<typeof vi.fn>;

describe('PecContactWizard', () => {
  const labelPrefix = 'legal-contacts.sercq-send-wizard.feedback';
  let mock: MockAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    setShowPecWizardMock = vi.fn();
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

  const VALID_PEC = 'test@pec.it';

  it('renders the component correctly', () => {
    const { container, getByTestId } = render(
      <PecContactWizard setShowPecWizard={setShowPecWizardMock} />
    );

    expect(getByTestId('pec-wizard-title')).toBeInTheDocument();
    expect(getByTestId('pec-wizard-input')).toBeInTheDocument();
    expect(getByTestId('prev-button')).toBeInTheDocument();
    expect(getByTestId('next-button')).toBeInTheDocument();

    const pecInput = container.querySelector('[name="pec"]');
    expect(pecInput).toHaveAttribute('type', 'email');
    expect(pecInput).toHaveAttribute('autocomplete', 'email');
  });

  it('calls setShowPecWizard when cancel button is clicked', async () => {
    const { getByTestId } = render(<PecContactWizard setShowPecWizard={setShowPecWizardMock} />);

    const cancelButton = getByTestId('prev-button');
    fireEvent.click(cancelButton);

    expect(setShowPecWizardMock).toHaveBeenCalledWith(false);
    expect(setShowPecWizardMock).toHaveBeenCalledTimes(1);
  });

  it('validates PEC input field and shows an error on invalid input', async () => {
    const { container, getByTestId } = render(
      <PecContactWizard setShowPecWizard={setShowPecWizardMock} />
    );

    const pecInput = container.querySelector('[name="pec"]');
    fireEvent.change(pecInput!, { target: { value: 'invalid value' } });

    await waitFor(() => {
      expect(pecInput).toHaveValue('invalid value');
    });
    const confirmButton = getByTestId('next-button');
    expect(confirmButton).toBeEnabled();
    const errorMessage = container.querySelector(`#pec-helper-text`);
    expect(errorMessage).toBeInTheDocument();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(0);
    });
  });

  it('validates PEC input field and shows an error on disclaimer not accepted', async () => {
    const { container, getByTestId } = render(
      <PecContactWizard setShowPecWizard={setShowPecWizardMock} />
    );

    const pecInput = container.querySelector('[name="pec"]');
    fireEvent.change(pecInput!, { target: { value: VALID_PEC } });

    await waitFor(() => {
      expect(pecInput).toHaveValue(VALID_PEC);
    });
    const confirmButton = getByTestId('next-button');
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    const errorMessage = await waitFor(() => container.querySelector(`#disclaimer-helper-text`));
    expect(errorMessage).toBeInTheDocument();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(0);
    });
  });

  it('should show alert when SERCQ SEND is enabled', async () => {
    const { getByTestId } = render(<PecContactWizard setShowPecWizard={setShowPecWizardMock} />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddressesSercq.filter(
            (addr) => addr.channelType === ChannelType.SERCQ_SEND
          ),
        },
      },
    });

    const alertMessage = getByTestId('sercq-info-alert');
    expect(alertMessage).toBeInTheDocument();
  });

  it('submits form and opens the code modal on valid PEC input', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', {
        value: VALID_PEC,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });

    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', {
        value: VALID_PEC,
        verificationCode: '01234',
      })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });

    const result = render(<PecContactWizard setShowPecWizard={setShowPecWizardMock} />, {
      route: [routes.NOTIFICHE, routes.DIGITAL_DOMICILE_ACTIVATION],
    });
    const { getByTestId, getByRole, container } = result;

    const pecInput = container.querySelector('[name="pec"]');
    fireEvent.change(pecInput!, { target: { value: VALID_PEC } });

    const disclaimerCheckbox = container.querySelector('[name="disclaimer"]');
    fireEvent.click(disclaimerCheckbox!);

    const nextButton = getByTestId('next-button');
    fireEvent.click(nextButton);

    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: VALID_PEC,
        verificationCode: '01234',
      });
    });

    await waitFor(() => expect(dialog).not.toBeInTheDocument());

    const feedbackStep = getByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();

    const feedbackTitle = getByTestId('wizard-feedback-title');
    expect(feedbackTitle).toHaveTextContent(`${labelPrefix}.title-pec-activation`);
    const feedbackContent = getByTestId('wizard-feedback-content');
    expect(feedbackContent).toHaveTextContent(`${labelPrefix}.content-pec`);

    const feedbackButton = getByRole('button', { name: 'button.understand' });

    fireEvent.click(feedbackButton);
    expect(result.router.state.location.pathname).toBe(routes.NOTIFICHE);
  });

  it('should render component and feedback step correctly when transferring', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', {
        value: VALID_PEC,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });

    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', {
        value: VALID_PEC,
        verificationCode: '01234',
      })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });

    const result = render(
      <PecContactWizard setShowPecWizard={setShowPecWizardMock} isTransferring />,
      { route: [routes.NOTIFICHE, routes.DIGITAL_DOMICILE_ACTIVATION] }
    );
    const { getByRole, getByTestId, queryByTestId, container } = result;

    const pecInput = container.querySelector('[name="pec"]');
    fireEvent.change(pecInput!, { target: { value: VALID_PEC } });

    const disclaimerCheckbox = container.querySelector('[name="disclaimer"]');
    fireEvent.click(disclaimerCheckbox!);

    const nextButton = getByTestId('next-button');
    fireEvent.click(nextButton);

    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: VALID_PEC,
        verificationCode: '01234',
      });
    });

    await waitFor(() => expect(dialog).not.toBeInTheDocument());

    const feedbackStep = queryByTestId('wizard-feedback-step');
    expect(feedbackStep).toBeInTheDocument();

    const feedbackTitle = getByTestId('wizard-feedback-title');
    expect(feedbackTitle).toHaveTextContent(`${labelPrefix}.title-pec-transfer`);
    const feedbackContent = getByTestId('wizard-feedback-content');
    expect(feedbackContent).toHaveTextContent(`${labelPrefix}.content-pec`);

    const feedbackButton = getByRole('button', { name: 'button.understand' });

    fireEvent.click(feedbackButton);
    expect(result.router.state.location.pathname).toBe(routes.NOTIFICHE);
  });
});
