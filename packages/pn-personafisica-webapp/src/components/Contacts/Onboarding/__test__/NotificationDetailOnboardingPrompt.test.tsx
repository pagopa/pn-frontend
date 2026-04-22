import { Provider } from 'react-redux';
import { RouterProvider, createMemoryRouter, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';

import { Configuration } from '@pagopa-pn/pn-commons';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AddressType, ChannelType, DigitalAddress } from '../../../../models/contacts';
import generalInfoSlice from '../../../../redux/sidemenu/reducers';
import type { PfConfiguration } from '../../../../services/configuration.service';
import NotificationDetailOnboardingPrompt from '../NotificationDetailOnboardingPrompt';

const getPaymentCacheMock = vi.fn();

vi.mock('@pagopa-pn/pn-commons', async () => {
  const actual = await vi.importActual<typeof import('@pagopa-pn/pn-commons')>(
    '@pagopa-pn/pn-commons'
  );

  return {
    ...actual,
    getPaymentCache: (...args: unknown[]) => getPaymentCacheMock(...args),
  };
});

type ContactsState = {
  digitalAddresses: Array<DigitalAddress>;
};

const contactsInitialState: ContactsState = {
  digitalAddresses: [],
};

const contactsReducer = (state: ContactsState = contactsInitialState) => state;

const PromptTestComponent = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div>Detail page</div>
      <button onClick={() => navigate('/notifiche')}>Go notifications</button>
      <button onClick={() => navigate('/other')}>Go other</button>
    </div>
  );
};

type RenderOptions = {
  mandateId?: string;
  paymentCacheValue?: unknown;
  onboardingDataOverrides?: Partial<{
    hasBeenShown: boolean;
    hasSkippedOnboarding: boolean;
    exitReminderShown: boolean;
  }>;
  addresses?: Array<DigitalAddress>;
};

const renderComponent = ({
  mandateId,
  paymentCacheValue = undefined,
  onboardingDataOverrides,
  addresses = [],
}: RenderOptions = {}) => {
  getPaymentCacheMock.mockReturnValue(paymentCacheValue);

  const store = configureStore({
    reducer: {
      generalInfoState: generalInfoSlice.reducer,
      contactsState: contactsReducer,
    },
    preloadedState: {
      generalInfoState: {
        pendingDelegators: 0,
        delegators: [],
        domicileBannerOpened: true,
        paymentTpp: {
          pspDenomination: '',
          retrievalId: '',
          iun: '',
          isPaymentEnabled: false,
        },
        onboardingData: {
          hasBeenShown: false,
          hasSkippedOnboarding: false,
          exitReminderShown: false,
          ...onboardingDataOverrides,
        },
      },
      contactsState: {
        digitalAddresses: addresses,
      },
    },
  });

  const router = createMemoryRouter(
    [
      {
        path: '/detail',
        element: (
          <Provider store={store}>
            <NotificationDetailOnboardingPrompt
              iun="TEST_IUN"
              mandateId={mandateId}
              route="/notifiche"
            >
              <PromptTestComponent />
            </NotificationDetailOnboardingPrompt>
          </Provider>
        ),
      },
      {
        path: '/notifiche',
        element: <div>Notifications page</div>,
      },
      {
        path: '/onboarding',
        element: <div>Onboarding page</div>,
      },
      {
        path: '/other',
        element: <div>Other page</div>,
      },
    ],
    {
      initialEntries: ['/detail'],
      initialIndex: 0,
    }
  );

  const user = userEvent.setup();

  render(<RouterProvider router={router} />);

  return { user, router, store };
};

describe('NotificationDetailOnboardingPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Configuration.setForTest<PfConfiguration>({
      IS_ONBOARDING_ENABLED: true,
    } as PfConfiguration);
  });

  it('should open the modal when navigation to notifications is blocked', async () => {
    const { user, router, store } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Go notifications' }));

    expect(await screen.findByTestId('confirmationDialog')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/detail');
    expect(store.getState().generalInfoState.onboardingData.exitReminderShown).toBe(true);
  });

  it('should navigate to onboarding when clicking configure after blocked navigation', async () => {
    const { user, router } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Go notifications' }));
    expect(await screen.findByTestId('confirmationDialog')).toBeInTheDocument();

    await user.click(screen.getByTestId('confirmButton'));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/onboarding');
    });

    expect(screen.getByText('Onboarding page')).toBeInTheDocument();
  });

  it('should continue to notifications when clicking skip after blocked navigation', async () => {
    const { user, router } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Go notifications' }));
    expect(await screen.findByTestId('confirmationDialog')).toBeInTheDocument();

    await user.click(screen.getByTestId('closeButton'));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/notifiche');
    });

    expect(screen.getByText('Notifications page')).toBeInTheDocument();
  });

  it('should open the modal automatically when returning from payment', async () => {
    const { router, store } = renderComponent({
      paymentCacheValue: {
        currentPayment: 1,
      },
    });

    expect(await screen.findByTestId('confirmationDialog')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/detail');
    expect(store.getState().generalInfoState.onboardingData.exitReminderShown).toBe(true);
  });

  it('should close the modal and remain on detail when clicking skip after returning from payment', async () => {
    const { user, router } = renderComponent({
      paymentCacheValue: {
        currentPayment: 1,
      },
    });

    expect(await screen.findByTestId('confirmationDialog')).toBeInTheDocument();

    await user.click(screen.getByTestId('closeButton'));

    await waitFor(() => {
      expect(screen.queryByTestId('confirmationDialog')).not.toBeInTheDocument();
    });

    expect(router.state.location.pathname).toBe('/detail');
    expect(screen.getByText('Detail page')).toBeInTheDocument();
  });

  it('should not open the modal when onboarding feature is disabled', async () => {
    Configuration.setForTest<PfConfiguration>({
      IS_ONBOARDING_ENABLED: false,
    } as PfConfiguration);

    renderComponent({
      paymentCacheValue: {
        currentPayment: 1,
      },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('confirmationDialog')).not.toBeInTheDocument();
    });
  });

  it('should not open the modal in delegate flow', async () => {
    renderComponent({
      mandateId: 'MANDATE_ID',
      paymentCacheValue: {
        currentPayment: 1,
      },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('confirmationDialog')).not.toBeInTheDocument();
    });
  });

  it('should not open the modal when the user already has required contacts', async () => {
    renderComponent({
      paymentCacheValue: {
        currentPayment: 1,
      },
      addresses: [
        {
          addressType: AddressType.COURTESY,
          channelType: ChannelType.EMAIL,
          senderId: 'default',
          value: 'test@mail.com',
        },
        {
          addressType: AddressType.COURTESY,
          channelType: ChannelType.IOMSG,
          senderId: 'default',
          value: 'ENABLED',
        },
      ],
    });

    await waitFor(() => {
      expect(screen.queryByTestId('confirmationDialog')).not.toBeInTheDocument();
    });
  });

  it('should not open the modal when the exit reminder has already been shown', async () => {
    renderComponent({
      paymentCacheValue: {
        currentPayment: 1,
      },
      onboardingDataOverrides: {
        exitReminderShown: true,
      },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('confirmationDialog')).not.toBeInTheDocument();
    });
  });

  it('should not block navigation to routes different from the configured route', async () => {
    const { user, router } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Go other' }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/other');
    });

    expect(screen.getByText('Other page')).toBeInTheDocument();
  });
});
