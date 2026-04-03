import { vi } from 'vitest';

import {
  DeliveryOutcomeType,
  DigitalSource,
  NotificationCostDetailsStatus,
} from '@pagopa-pn/pn-commons';

import { digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { ChannelType, ContactOperation, ContactSource } from '../../../models/contacts';
import * as routes from '../../../navigation/routes.const';
import { NotificationCostBanner } from '../NotificationCostBanner';

const sercqSendDefault = digitalAddressesSercq.find(
  (addr) => addr.senderId === 'default' && addr.channelType === ChannelType.SERCQ_SEND
);

describe('NotificationCostBanner component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component - deliveryOutcome null - dd domicile not active', () => {
    const { container, getByTestId, getByText, testStore, router } = render(
      <NotificationCostBanner deliveryOutcome={null} />,
      {
        preloadedState: {
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.viewed.title');
    expect(container).toHaveTextContent('notification-cost-banner.viewed.message');
    expect(container).toHaveTextContent('notification-cost-banner.enable-sercq.message.default');

    const cta = getByText('notification-cost-banner.enable-sercq.cta');
    fireEvent.click(cta);

    expect(router.state.location.pathname).toBe(routes.DIGITAL_DOMICILE_ACTIVATION);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.SERCQ_SEND,
      source: ContactSource.DETTAGLIO_NOTIFICA,
      operation: ContactOperation.ADD,
    });
  });

  it('renders the component - analog - dd domicile not active without cost details', () => {
    const deliveryOutcome = { type: DeliveryOutcomeType.ANALOG } as any;

    const { container, getByTestId, getByText, testStore, router } = render(
      <NotificationCostBanner deliveryOutcome={deliveryOutcome} />,
      {
        preloadedState: {
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.analog.title');
    expect(container).toHaveTextContent('notification-cost-banner.analog.fallback');
    expect(container).toHaveTextContent('notification-cost-banner.enable-sercq.message.analog');

    const cta = getByText('notification-cost-banner.enable-sercq.cta');
    fireEvent.click(cta);

    expect(router.state.location.pathname).toBe(routes.DIGITAL_DOMICILE_ACTIVATION);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.SERCQ_SEND,
      source: ContactSource.DETTAGLIO_NOTIFICA,
      operation: ContactOperation.ADD,
    });
  });

  it('renders the component - analog - dd domicile not active, cost details and status OK', () => {
    const deliveryOutcome = { type: DeliveryOutcomeType.ANALOG } as any;
    const notificationCost = { status: NotificationCostDetailsStatus.OK, analogCost: 100 };
    const { container, getByTestId, getByText, testStore, router } = render(
      <NotificationCostBanner
        deliveryOutcome={deliveryOutcome}
        notificationCost={notificationCost}
      />,
      {
        preloadedState: {
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.analog.title');
    expect(container).toHaveTextContent('notification-cost-banner.analog.message');
    expect(container).toHaveTextContent('notification-cost-banner.enable-sercq.message.analog');

    const cta = getByText('notification-cost-banner.enable-sercq.cta');
    fireEvent.click(cta);

    expect(router.state.location.pathname).toBe(routes.DIGITAL_DOMICILE_ACTIVATION);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.SERCQ_SEND,
      source: ContactSource.DETTAGLIO_NOTIFICA,
      operation: ContactOperation.ADD,
    });
  });

  it('renders the component - digital failure - dd domicile not active without cost details', () => {
    const deliveryOutcome = { type: DeliveryOutcomeType.DIGITAL_FAILURE } as any;

    const { container, getByTestId, getByText, testStore, router } = render(
      <NotificationCostBanner deliveryOutcome={deliveryOutcome} />,
      {
        preloadedState: {
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.digital_failure.title');
    expect(container).toHaveTextContent('notification-cost-banner.digital_failure.fallback');
    expect(container).toHaveTextContent(
      'notification-cost-banner.enable-sercq.message.external-pec'
    );

    const cta = getByText('notification-cost-banner.enable-sercq.cta');
    fireEvent.click(cta);

    expect(router.state.location.pathname).toBe(routes.DIGITAL_DOMICILE_ACTIVATION);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.SERCQ_SEND,
      source: ContactSource.DETTAGLIO_NOTIFICA,
      operation: ContactOperation.ADD,
    });
  });

  it('renders the component - digital failure - dd domicile not active, with cost details and status OK', () => {
    const deliveryOutcome = { type: DeliveryOutcomeType.DIGITAL_FAILURE } as any;
    const notificationCost = { status: NotificationCostDetailsStatus.OK, analogCost: 100 };
    const { container, getByTestId, getByText, testStore, router } = render(
      <NotificationCostBanner
        deliveryOutcome={deliveryOutcome}
        notificationCost={notificationCost}
      />,
      {
        preloadedState: {
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.digital_failure.title');
    expect(container).toHaveTextContent('notification-cost-banner.digital_failure.message');
    expect(container).toHaveTextContent(
      'notification-cost-banner.enable-sercq.message.external-pec'
    );

    const cta = getByText('notification-cost-banner.enable-sercq.cta');
    fireEvent.click(cta);

    expect(router.state.location.pathname).toBe(routes.DIGITAL_DOMICILE_ACTIVATION);
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

    const { container, getByTestId, getByText, testStore, router } = render(
      <NotificationCostBanner deliveryOutcome={deliveryOutcome} />,
      {
        preloadedState: {
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.digital_registry.title');
    expect(container).toHaveTextContent('notification-cost-banner.digital_registry.message');
    expect(container).toHaveTextContent(
      'notification-cost-banner.enable-sercq.message.external-pec'
    );

    const cta = getByText('notification-cost-banner.enable-sercq.cta');
    fireEvent.click(cta);

    expect(router.state.location.pathname).toBe(routes.DIGITAL_DOMICILE_ACTIVATION);
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
          contactsState: { digitalAddresses: [sercqSendDefault] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.digital_special.title');
    expect(container).toHaveTextContent('notification-cost-banner.digital_special.message');
    expect(container).not.toHaveTextContent(
      'notification-cost-banner.enable-sercq.message.external-pec'
    );

    const cta = queryByText('notification-cost-banner.enable-sercq.cta');
    expect(cta).not.toBeInTheDocument();

    const closeButton = getByLabelText('button.close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      const closedBanner = queryByTestId('notificationCostBanner');
      expect(closedBanner).not.toBeInTheDocument();
    });
  });

  it('renders the component with cost details but status UNAVAILABLE', () => {
    const deliveryOutcome = { type: DeliveryOutcomeType.DIGITAL_FAILURE } as any;
    const notificationCost = { status: NotificationCostDetailsStatus.UNAVAILABLE, analogCost: 100 };
    const { container, getByTestId, getByText, testStore, router } = render(
      <NotificationCostBanner
        deliveryOutcome={deliveryOutcome}
        notificationCost={notificationCost}
      />,
      {
        preloadedState: {
          contactsState: { digitalAddresses: [] },
        },
      }
    );

    const banner = getByTestId('notificationCostBanner');
    expect(banner).toBeInTheDocument();

    expect(container).toHaveTextContent('notification-cost-banner.digital_failure.title');
    expect(container).toHaveTextContent('notification-cost-banner.digital_failure.fallback');
    expect(container).toHaveTextContent(
      'notification-cost-banner.enable-sercq.message.external-pec'
    );

    const cta = getByText('notification-cost-banner.enable-sercq.cta');
    fireEvent.click(cta);

    expect(router.state.location.pathname).toBe(routes.DIGITAL_DOMICILE_ACTIVATION);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.SERCQ_SEND,
      source: ContactSource.DETTAGLIO_NOTIFICA,
      operation: ContactOperation.ADD,
    });
  });
});
