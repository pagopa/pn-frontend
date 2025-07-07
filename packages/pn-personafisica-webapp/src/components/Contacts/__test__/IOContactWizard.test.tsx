import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
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

  it('should activate IO clicking on activate button', async () => {
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

  it('should activate IO clicking on activate button in the confirmation modal', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/APPIO', {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);

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

    // first close the dialog
    const ioConfirmSkipButton = getByTestId('closeButton');

    fireEvent.click(ioConfirmSkipButton);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
      expect(goToNextStep).toHaveBeenCalledTimes(1);
    });

    // reopen dialog and confirm action
    fireEvent.click(ioSkipButton);
    dialog = await waitFor(() => getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    const ioConfirmActivationButton = within(dialog).getByTestId('confirmButton');
    fireEvent.click(ioConfirmActivationButton);

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(goToNextStep).toHaveBeenCalledTimes(2);
    });
  });

  it('should deactivate IO clicking on deactivate button', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/APPIO').reply(200);

    const { getByTestId, getByRole } = render(<IOContactWizard goToNextStep={goToNextStep} />, {
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

    const disableIOButton = getByTestId('disableIOButton');
    expect(disableIOButton).toBeInTheDocument();
    fireEvent.click(disableIOButton);

    // open dialog and click on cancel
    let dialog = await waitFor(() => getByRole('dialog'));
    const cancelIOdisable = getByTestId('confirmButton');
    fireEvent.click(cancelIOdisable);

    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
      expect(goToNextStep).toHaveBeenCalledTimes(1);
    });

    // reopen dialog and click on confirm
    fireEvent.click(disableIOButton);
    dialog = await waitFor(() => getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    const ioConfirmDeactivationButton = within(dialog).getByTestId('closeButton');
    fireEvent.click(ioConfirmDeactivationButton);

    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
      expect(goToNextStep).toHaveBeenCalledTimes(2);
    });
  });
});
