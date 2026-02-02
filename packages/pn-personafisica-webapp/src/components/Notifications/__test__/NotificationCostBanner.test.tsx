import { vi } from 'vitest';

import { DeliveryOutcomeType, DigitalSource } from '@pagopa-pn/pn-commons';

import { digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, testStore, waitFor } from '../../../__test__/test-utils';
import { ChannelType, ContactOperation, ContactSource } from '../../../models/contacts';
import * as routes from '../../../navigation/routes.const';
import { NotificationCostBanner } from '../NotificationCostBanner';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

const sercqSendDefault = digitalAddressesSercq.find(
  (addr) => addr.senderId === 'default' && addr.channelType === ChannelType.SERCQ_SEND
);

describe('NotificationCostBanner component', () => {
  afterEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders the component - deliveryOutcome null - dd domicile not active', () => {
    const { container, getByTestId, getByText } = render(
      <NotificationCostBanner deliveryOutcome={null} />,
      {
        preloadedState: {
          generalInfoState: { domicileBannerOpened: true },
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.viewed.title');
    expect(container).toHaveTextContent('notification-cost-banner.viewed.message');
    expect(container).toHaveTextContent('notification-cost-banner.enable-sercq.message');

    const cta = getByText('notification-cost-banner.enable-sercq.cta');
    fireEvent.click(cta);

    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.DIGITAL_DOMICILE_ACTIVATION);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.SERCQ_SEND,
      source: ContactSource.DETTAGLIO_NOTIFICA,
      operation: ContactOperation.ADD,
    });
  });

  it('renders the component - analog - dd domicile not active', () => {
    const deliveryOutcome = { type: DeliveryOutcomeType.ANALOG } as any;

    const { container, getByTestId, getByText } = render(
      <NotificationCostBanner deliveryOutcome={deliveryOutcome} />,
      {
        preloadedState: {
          generalInfoState: { domicileBannerOpened: true },
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.analog.title');
    expect(container).toHaveTextContent('notification-cost-banner.analog.message');
    expect(container).toHaveTextContent('notification-cost-banner.enable-sercq.message');

    const cta = getByText('notification-cost-banner.enable-sercq.cta');
    fireEvent.click(cta);

    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.DIGITAL_DOMICILE_ACTIVATION);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.SERCQ_SEND,
      source: ContactSource.DETTAGLIO_NOTIFICA,
      operation: ContactOperation.ADD,
    });
  });

  it('renders the component - digital failure - dd domicile not active', () => {
    const deliveryOutcome = { type: DeliveryOutcomeType.DIGITAL_FAILURE } as any;

    const { container, getByTestId, getByText } = render(
      <NotificationCostBanner deliveryOutcome={deliveryOutcome} />,
      {
        preloadedState: {
          generalInfoState: { domicileBannerOpened: true },
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.digital_failure.title');
    expect(container).toHaveTextContent('notification-cost-banner.digital_failure.message');
    expect(container).toHaveTextContent('notification-cost-banner.enable-sercq.message');

    const cta = getByText('notification-cost-banner.enable-sercq.cta');
    fireEvent.click(cta);

    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.DIGITAL_DOMICILE_ACTIVATION);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.SERCQ_SEND,
      source: ContactSource.DETTAGLIO_NOTIFICA,
      operation: ContactOperation.ADD,
    });
  });

  it('renders the component - digital registry - dd domicile not active', () => {
    const deliveryOutcome = {
      type: DeliveryOutcomeType.DIGITAL,
      details: { source: DigitalSource.REGISTRY, domicileType: 'SERCQ' },
    } as any;

    const { container, getByTestId, getByText } = render(
      <NotificationCostBanner deliveryOutcome={deliveryOutcome} />,
      {
        preloadedState: {
          generalInfoState: { domicileBannerOpened: true },
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.digital_registry.title');
    expect(container).toHaveTextContent('notification-cost-banner.digital_registry.message');
    expect(container).toHaveTextContent('notification-cost-banner.enable-sercq.message');

    const cta = getByText('notification-cost-banner.enable-sercq.cta');
    fireEvent.click(cta);

    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.DIGITAL_DOMICILE_ACTIVATION);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.SERCQ_SEND,
      source: ContactSource.DETTAGLIO_NOTIFICA,
      operation: ContactOperation.ADD,
    });
  });

  it('renders the component - digital platform', () => {
    const deliveryOutcome = {
      type: DeliveryOutcomeType.DIGITAL,
      details: { source: DigitalSource.PLATFORM, domicileType: 'SERCQ' },
    } as any;

    const { container, getByTestId, queryByText } = render(
      <NotificationCostBanner deliveryOutcome={deliveryOutcome} />,
      {
        preloadedState: {
          generalInfoState: { domicileBannerOpened: true },
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.digital_platform.title');
    expect(container).toHaveTextContent('notification-cost-banner.digital_platform.message');
    expect(container).not.toHaveTextContent('notification-cost-banner.enable-sercq.message');

    const cta = queryByText('notification-cost-banner.enable-sercq.cta');
    expect(cta).not.toBeInTheDocument();
  });

  it('renders the component - digital special - dd domicile active - closes the banner', async () => {
    const deliveryOutcome = {
      type: DeliveryOutcomeType.DIGITAL,
      details: { source: DigitalSource.SENDER, domicileType: 'SERCQ' },
    } as any;

    const { container, getByTestId, getByLabelText, queryByTestId, queryByText } = render(
      <NotificationCostBanner deliveryOutcome={deliveryOutcome} />,
      {
        preloadedState: {
          generalInfoState: { domicileBannerOpened: true },
          contactsState: { digitalAddresses: [sercqSendDefault] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.digital_special.title');
    expect(container).toHaveTextContent('notification-cost-banner.digital_special.message');
    expect(container).not.toHaveTextContent('notification-cost-banner.enable-sercq.message');

    const cta = queryByText('notification-cost-banner.enable-sercq.cta');
    expect(cta).not.toBeInTheDocument();

    const closeButton = getByLabelText('button.close');
    fireEvent.click(closeButton);

    expect(sessionStorage.getItem('domicileBannerClosed')).toBe('true');

    await waitFor(() => {
      const closedBanner = queryByTestId('notificationCostBanner');
      expect(closedBanner).not.toBeInTheDocument();
    });
  });

  it('does not render the component when banner is closed from store', () => {
    const deliveryOutcome = { type: DeliveryOutcomeType.ANALOG } as any;

    const { queryByTestId } = render(<NotificationCostBanner deliveryOutcome={deliveryOutcome} />, {
      preloadedState: {
        generalInfoState: { domicileBannerOpened: false },
        contactsState: { digitalAddresses: [] },
      },
    });

    const banner = queryByTestId('notificationCostBanner');
    expect(banner).not.toBeInTheDocument();
  });
});
