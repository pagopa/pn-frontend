import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType, IOAllowedValues } from '../../../models/contacts';
import IOContactWizard from '../IOContactWizard';

describe('IOContactWizard', () => {
  const goToNextStep = vi.fn();
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render component', () => {
    const { getByText, getByTestId } = render(<IOContactWizard goToNextStep={goToNextStep} />);

    const title = getByText('legal-contacts.sercq-send-wizard.step_2.title');
    expect(title).toBeInTheDocument();
    const content = getByText('legal-contacts.sercq-send-wizard.step_2.content');
    expect(content).toBeInTheDocument();
    const illustration = getByTestId('ioContactIllustration');
    expect(illustration).toBeInTheDocument();
    const confirmButton = getByTestId('confirmButton');
    expect(confirmButton).toBeInTheDocument();
  });

  it('should activate IO on confirm button click', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/APPIO', {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);

    const { getByTestId } = render(<IOContactWizard goToNextStep={goToNextStep} />);
    const confirmButton = getByTestId('confirmButton');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });
    expect(goToNextStep).toHaveBeenCalledTimes(1);
  });

  it('shows the confirmation modals trying to skip App IO', async () => {
    const { getByTestId, getByRole, getByText } = render(
      <IOContactWizard goToNextStep={goToNextStep} />,
      {
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
      }
    );

    const ioSkipButton = getByTestId('skipButton');
    fireEvent.click(ioSkipButton);

    let dialog = await waitFor(() => getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    getByText('courtesy-contacts.confirmation-modal-title');
    getByText('courtesy-contacts.confirmation-modal-io-content');
    getByText('courtesy-contacts.confirmation-modal-io-accept');
    const ioConfirmSkipButton = getByText('button.do-later');

    fireEvent.click(ioConfirmSkipButton);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });
});
