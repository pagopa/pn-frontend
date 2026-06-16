import { fireEvent, render, waitFor } from '../../../../../__test__/test-utils';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../../models/contacts';
import OnboardingCourtesyWizard from '../OnboardingCourtesyWizard';

describe('OnboardingCourtesyWizard', () => {
  const labelPrefix = 'onboarding.courtesy';

  it('renders the wizard title and starts from the IO step', () => {
    const { getByText, getByTestId } = render(<OnboardingCourtesyWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [],
        },
      },
    });

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.step-1-label`)).toBeInTheDocument();
    expect(getByTestId('io-step')).toBeInTheDocument();
  });

  it('shows the "proceed without IO" action when IO is not enabled', () => {
    const { getByRole } = render(<OnboardingCourtesyWizard />, {
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

    expect(getByRole('button', { name: `${labelPrefix}.proceed-without-io` })).toBeInTheDocument();
  });

  it('shows the wizard continue button on the IO step when IO is enabled', () => {
    const { getByRole, queryByRole } = render(<OnboardingCourtesyWizard />, {
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

    expect(
      queryByRole('button', { name: `${labelPrefix}.proceed-without-io` })
    ).not.toBeInTheDocument();
    expect(getByRole('button', { name: 'button.continue' })).toBeInTheDocument();
  });

  it('shows both step labels in the stepper', () => {
    const { getByText } = render(<OnboardingCourtesyWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [],
        },
      },
    });

    expect(getByText(`${labelPrefix}.step-1-label`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.step-2-label`)).toBeInTheDocument();
  });

  it('advances to the email/sms step after clicking proceed-without-io', () => {
    const { getByRole, getByTestId } = render(<OnboardingCourtesyWizard />, {
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

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.proceed-without-io` }));

    expect(getByTestId('email-sms-step')).toBeInTheDocument();
  });

  it('reaches the success step after completing both wizard steps', async () => {
    const { getByRole, getByText, getByTestId } = render(<OnboardingCourtesyWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.ENABLED,
            },
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.EMAIL,
              value: 'test@mock.pagopa.it',
            },
          ],
        },
      },
    });

    // IO step → continue (IO is enabled)
    fireEvent.click(getByRole('button', { name: 'button.continue' }));

    // Email/SMS step → confirm (an email is set)
    await waitFor(() => {
      fireEvent.click(getByTestId('next-button'));
    });

    await waitFor(() => {
      expect(getByText(`${labelPrefix}.success-title`)).toBeInTheDocument();
    });
  });
});
