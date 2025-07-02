import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { ChannelType } from '../../../models/contacts';
import PecContactWizard from '../PecContactWizard';
import { fillCodeDialog } from './test-utils';

describe('PecContactWizard', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  const setShowPecWizardMock = vi.fn();
  const VALID_PEC = 'test@pec.it';

  it('renders the component correctly', () => {
    const { getByTestId } = render(<PecContactWizard setShowPecWizard={setShowPecWizardMock} />);

    expect(getByTestId('pec-wizard-title')).toBeInTheDocument();
    expect(getByTestId('pec-wizard-input')).toBeInTheDocument();
    expect(getByTestId('prev-button')).toBeInTheDocument();
    expect(getByTestId('next-button')).toBeInTheDocument();
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

    const result = render(<PecContactWizard setShowPecWizard={setShowPecWizardMock} />);
    const { getByTestId, queryByTestId, container } = result;

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

    expect(setShowPecWizardMock).toHaveBeenCalledWith(false);
    expect(setShowPecWizardMock).toHaveBeenCalledTimes(1);

    const feedbackStep = queryByTestId('wizard-feedback-step');
    expect(feedbackStep).not.toBeInTheDocument();
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
      <PecContactWizard setShowPecWizard={setShowPecWizardMock} isTransferring />
    );
    const { getByTestId, queryByTestId, container } = result;

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
  });
});
