import { fireEvent, render } from '../../../../__test__/test-utils';
import { OnboardingAvailableFlows } from '../../../../models/Onboarding';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../models/contacts';
import * as routes from '../../../../navigation/routes.const';
import OnboardingHome from '../OnboardingHome';

describe('OnboardingHome', () => {
  const labelPrefix = 'onboarding';

  const emptyContactsState = { contactsState: { digitalAddresses: [] } };

  it('renders title, description and exit button', () => {
    const { getByText, getByRole } = render(<OnboardingHome />, {
      preloadedState: emptyContactsState,
    });

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.exit-flow` })).toBeInTheDocument();
  });

  it('renders all three cards when IO is not enabled', () => {
    const { getByText, getByTestId } = render(<OnboardingHome />, {
      preloadedState: emptyContactsState,
    });

    expect(getByText(`${labelPrefix}.cards.send.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.cards.contacts.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.cards.io.title`)).toBeInTheDocument();
    expect(
      getByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.DIGITAL_DOMICILE}`)
    ).toBeInTheDocument();
    expect(
      getByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.COURTESY}`)
    ).toBeInTheDocument();
    expect(getByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.IO}`)).toBeInTheDocument();
  });

  it('hides the IO card when IO is already enabled', () => {
    const { queryByText, queryByTestId } = render(<OnboardingHome />, {
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

    expect(queryByText(`${labelPrefix}.cards.io.title`)).not.toBeInTheDocument();
    expect(
      queryByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.IO}`)
    ).not.toBeInTheDocument();
  });

  it('dispatches setOnboardingHasBeenShown(true) on mount', () => {
    const { testStore } = render(<OnboardingHome />, {
      preloadedState: emptyContactsState,
    });

    expect(testStore.getState().generalInfoState.onboardingData.hasBeenShown).toBe(true);
  });

  it('navigates to the digital domicile path when the first card CTA is clicked', () => {
    const { getByTestId, router } = render(<OnboardingHome />, {
      preloadedState: emptyContactsState,
    });

    fireEvent.click(
      getByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.DIGITAL_DOMICILE}`)
    );

    expect(router.state.location.pathname).toContain(routes.ONBOARDING_DIGITAL_DOMICILE);
  });

  it('navigates to the courtesy path when the courtesy card CTA is clicked', () => {
    const { getByTestId, router } = render(<OnboardingHome />, {
      preloadedState: emptyContactsState,
    });

    fireEvent.click(getByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.COURTESY}`));

    expect(router.state.location.pathname).toContain(routes.ONBOARDING_COURTESY);
  });

  it('navigates to the IO path when the IO card CTA is clicked', () => {
    const { getByTestId, router } = render(<OnboardingHome />, {
      preloadedState: emptyContactsState,
    });

    fireEvent.click(getByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.IO}`));

    expect(router.state.location.pathname).toContain(routes.ONBOARDING_IO);
  });

  it('dispatches setOnboardingSelectedFlow with the correct flow when a card CTA is clicked', () => {
    const { getByTestId, testStore } = render(<OnboardingHome />, {
      preloadedState: emptyContactsState,
    });

    fireEvent.click(getByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.COURTESY}`));

    expect(testStore.getState().generalInfoState.onboardingData.onboardingSelectedFlow).toBe(
      OnboardingAvailableFlows.COURTESY
    );
  });

  it('opens the confirmation modal when the exit button is clicked', () => {
    const { getByRole, getByText, queryByTestId } = render(<OnboardingHome />, {
      preloadedState: emptyContactsState,
    });

    expect(queryByTestId('confirmationDialog')).not.toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.exit-flow` }));

    expect(getByText(`${labelPrefix}.exit-flow-dialog.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.exit-flow-dialog.description`)).toBeInTheDocument();
    expect(queryByTestId('confirmationDialog')).toBeInTheDocument();
  });

  it('navigates to notifications and dispatches setHasSkippedOnboarding when exit is confirmed', () => {
    const { getByRole, getByTestId, testStore, router } = render(<OnboardingHome />, {
      preloadedState: emptyContactsState,
    });

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.exit-flow` }));
    fireEvent.click(getByTestId('confirmButton'));

    expect(testStore.getState().generalInfoState.onboardingData.hasSkippedOnboarding).toBe(true);
    expect(router.state.location.pathname).toBe(routes.NOTIFICHE);
  });
});
