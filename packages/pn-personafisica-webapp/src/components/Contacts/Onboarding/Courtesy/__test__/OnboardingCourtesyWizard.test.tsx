import { render } from '../../../../../__test__/test-utils';
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

    expect(
      getByRole('button', { name: `${labelPrefix}.proceed-without-io` })
    ).toBeInTheDocument();
  });

  it('hides the wizard next button on the IO step when IO is enabled', () => {
    const { queryByRole } = render(<OnboardingCourtesyWizard />, {
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
    expect(queryByRole('button', { name: 'button.continue' })).not.toBeInTheDocument();
  });
});
