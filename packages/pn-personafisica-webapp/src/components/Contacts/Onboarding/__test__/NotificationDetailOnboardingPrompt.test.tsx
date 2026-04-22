import { Route, Routes, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';

import { Configuration, PAYMENT_CACHE_KEY, setPaymentCache } from '@pagopa-pn/pn-commons';
import userEvent from '@testing-library/user-event';

import { render, screen, waitFor } from '../../../../__test__/test-utils';
import { AddressType, ChannelType, DigitalAddress } from '../../../../models/contacts';
import * as routes from '../../../../navigation/routes.const';
import type { PfConfiguration } from '../../../../services/configuration.service';
import NotificationDetailOnboardingPrompt from '../NotificationDetailOnboardingPrompt';

const defaultOnboardingData = {
  hasBeenShown: false,
  hasSkippedOnboarding: false,
  exitReminderShown: false,
};

const defaultPaymentTpp = {
  pspDenomination: '',
  retrievalId: '',
  iun: '',
  isPaymentEnabled: false,
};

const PromptPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div>Detail page</div>
      <button onClick={() => navigate('/notifiche')}>Go notifications</button>
      <button onClick={() => navigate('/other')}>Go other</button>
    </div>
  );
};

const PromptRoutes = ({ mandateId }: { mandateId?: string }) => (
  <Routes>
    <Route
      path="/detail"
      element={
        <NotificationDetailOnboardingPrompt iun="TEST_IUN" mandateId={mandateId} route="/notifiche">
          <PromptPage />
        </NotificationDetailOnboardingPrompt>
      }
    />
    <Route path="/notifiche" element={<div>Notifications page</div>} />
    <Route path={routes.ONBOARDING} element={<div>Onboarding page</div>} />
    <Route path="/other" element={<div>Other page</div>} />
  </Routes>
);

type RenderOptions = {
  mandateId?: string;
  withPaymentReturn?: boolean;
  onboardingDataOverrides?: Partial<{
    hasBeenShown: boolean;
    hasSkippedOnboarding: boolean;
    exitReminderShown: boolean;
  }>;
  addresses?: Array<DigitalAddress>;
};

const renderComponent = ({
  mandateId,
  withPaymentReturn = false,
  onboardingDataOverrides,
  addresses = [],
}: RenderOptions = {}) => {
  if (withPaymentReturn) {
    setPaymentCache(
      {
        currentPayment: {
          creditorTaxId: 'creditor-tax-id',
          noticeCode: 'notice-code',
        },
      } as any,
      'TEST_IUN'
    );
  }

  const user = userEvent.setup();

  const renderResult = render(<PromptRoutes mandateId={mandateId} />, {
    route: '/detail',
    preloadedState: {
      generalInfoState: {
        pendingDelegators: 0,
        delegators: [],
        domicileBannerOpened: true,
        paymentTpp: defaultPaymentTpp,
        onboardingData: {
          ...defaultOnboardingData,
          ...onboardingDataOverrides,
        },
      },
      contactsState: {
        digitalAddresses: addresses,
      },
    },
  });

  return { user, ...renderResult };
};

describe('NotificationDetailOnboardingPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.removeItem(PAYMENT_CACHE_KEY);
    Configuration.setForTest<PfConfiguration>({
      IS_ONBOARDING_ENABLED: true,
    } as PfConfiguration);
  });

  it('should open the modal when navigation to notifications is blocked', async () => {
    const { user, router, testStore } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Go notifications' }));

    expect(await screen.findByTestId('confirmationDialog')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/detail');
    expect(testStore.getState().generalInfoState.onboardingData.exitReminderShown).toBe(true);
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
    const { router, testStore } = renderComponent({
      withPaymentReturn: true,
    });

    expect(await screen.findByTestId('confirmationDialog')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/detail');
    expect(testStore.getState().generalInfoState.onboardingData.exitReminderShown).toBe(true);
  });

  it('should close the modal and remain on detail when clicking skip after returning from payment', async () => {
    const { user, router } = renderComponent({
      withPaymentReturn: true,
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
      withPaymentReturn: true,
    });

    await waitFor(() => {
      expect(screen.queryByTestId('confirmationDialog')).not.toBeInTheDocument();
    });
  });

  it('should not open the modal in delegate flow', async () => {
    renderComponent({
      mandateId: 'MANDATE_ID',
      withPaymentReturn: true,
    });

    await waitFor(() => {
      expect(screen.queryByTestId('confirmationDialog')).not.toBeInTheDocument();
    });
  });

  it('should not open the modal when the user already has required contacts', async () => {
    renderComponent({
      withPaymentReturn: true,
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
      withPaymentReturn: true,
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
