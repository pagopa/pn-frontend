import { vi } from 'vitest';

import { digitalAddressesSercq, digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, testStore } from '../../../__test__/test-utils';
import {
  ChannelType,
  ContactOperation,
  ContactSource,
  IOAllowedValues,
} from '../../../models/contacts';
import * as routes from '../../../navigation/routes.const';
import DomicileBanner from '../DomicileBanner';

const mockNavigateFn = vi.fn();

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

const sercqSendDefault = digitalAddressesSercq.find(
  (addr) => addr.senderId === 'default' && addr.channelType === ChannelType.SERCQ_SEND
);
const emailDefault = digitalCourtesyAddresses.find(
  (addr) => addr.senderId === 'default' && addr.channelType === ChannelType.EMAIL
);

const appIO = digitalCourtesyAddresses.find(
  (addr) => addr.senderId === 'default' && addr.channelType === ChannelType.IOMSG
);

describe('DomicileBanner component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component - no SERCQ SEND enabled', () => {
    const { container, getByTestId, getByText } = render(
      <DomicileBanner source={ContactSource.HOME_NOTIFICHE} />
    );
    const dialog = getByTestId('addDomicileBanner');
    expect(dialog).toBeInTheDocument();
    expect(container).toHaveTextContent('domicile-banner.no-sercq-send-title');
    expect(container).toHaveTextContent('domicile-banner.no-sercq-send-description');
    const closeButton = getByTestId('CloseIcon');
    expect(closeButton).toBeInTheDocument();
    const button = getByText('domicile-banner.no-sercq-cta');
    fireEvent.click(button);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.RECAPITI);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.SERCQ_SEND,
      source: ContactSource.HOME_NOTIFICHE,
      operation: ContactOperation.ADD,
    });
  });

  it('renders the component - no SERCQ SEND enabled - banner closed', () => {
    sessionStorage.setItem('domicileBannerClosed', 'true');
    const { container, getByTestId, getByText, queryByTestId } = render(
      <DomicileBanner source={ContactSource.HOME_NOTIFICHE} />
    );
    const dialog = getByTestId('addDomicileBanner');
    expect(dialog).toBeInTheDocument();
    expect(container).toHaveTextContent('domicile-banner.no-courtesy-no-sercq-send-title');
    expect(container).toHaveTextContent('domicile-banner.no-courtesy-no-sercq-send-description');
    const closeButton = queryByTestId('CloseIcon');
    expect(closeButton).not.toBeInTheDocument();

    const button = getByText('domicile-banner.no-courtesy-no-sercq-send-cta');
    fireEvent.click(button);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.RECAPITI);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.EMAIL,
      source: ContactSource.HOME_NOTIFICHE,
      operation: ContactOperation.SCROLL,
    });
    sessionStorage.removeItem('domicileBannerClosed');
  });

  it('renders the component - SERCQ SEND enabled, no courtesy address', () => {
    const { container, getByTestId, getByText, queryByTestId } = render(
      <DomicileBanner source={ContactSource.HOME_NOTIFICHE} />,
      {
        preloadedState: {
          generalInfoState: { digitalAddresses: [sercqSendDefault], domicileBannerOpened: true },
        },
      }
    );
    const dialog = getByTestId('addDomicileBanner');
    expect(dialog).toBeInTheDocument();
    expect(container).toHaveTextContent('domicile-banner.no-courtesy-title');
    expect(container).toHaveTextContent('domicile-banner.no-courtesy-description');
    const closeButton = queryByTestId('CloseIcon');
    expect(closeButton).not.toBeInTheDocument();
    const button = getByText('domicile-banner.complete-addresses');
    fireEvent.click(button);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.RECAPITI);
    expect(testStore.getState().contactsState.event).toStrictEqual({
      destination: ChannelType.EMAIL,
      source: ContactSource.HOME_NOTIFICHE,
      operation: ContactOperation.SCROLL,
    });
  });

  it('renders the component - SERCQ SEND enabled, no courtesy address - recapiti page', () => {
    const { container, getByTestId, queryByText, queryByTestId } = render(
      <DomicileBanner source={ContactSource.RECAPITI} />,
      {
        preloadedState: {
          generalInfoState: { digitalAddresses: [sercqSendDefault], domicileBannerOpened: true },
        },
      }
    );
    const dialog = getByTestId('addDomicileBanner');
    expect(dialog).toBeInTheDocument();
    expect(container).toHaveTextContent('domicile-banner.no-courtesy-title');
    expect(container).toHaveTextContent('domicile-banner.no-courtesy-description');
    const closeButton = queryByTestId('CloseIcon');
    expect(closeButton).not.toBeInTheDocument();
    const button = queryByText('domicile-banner.complete-addresses');
    expect(button).not.toBeInTheDocument();
  });

  it('renders the component - SERCQ SEND enabled, email added, app IO not installed', () => {
    const { queryByTestId } = render(<DomicileBanner source={ContactSource.HOME_NOTIFICHE} />, {
      preloadedState: {
        generalInfoState: {
          digitalAddresses: [sercqSendDefault, emailDefault],
          domicileBannerOpened: true,
        },
      },
    });
    const dialog = queryByTestId('addDomicileBanner');
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders the component - SERCQ SEND enabled, email added, app IO disabled', () => {
    const { container, getByTestId, getByText, queryByTestId } = render(
      <DomicileBanner source={ContactSource.HOME_NOTIFICHE} />,
      {
        preloadedState: {
          generalInfoState: {
            digitalAddresses: [sercqSendDefault, emailDefault, appIO],
            domicileBannerOpened: true,
          },
        },
      }
    );
    const dialog = queryByTestId('addDomicileBanner');
    expect(dialog).toBeInTheDocument();
    expect(container).toHaveTextContent('domicile-banner.no-io-title');
    expect(container).toHaveTextContent('domicile-banner.no-io-description');
    const closeButton = getByTestId('CloseIcon');
    expect(closeButton).toBeInTheDocument();
    const button = getByText('domicile-banner.add-io');
    fireEvent.click(button);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.RECAPITI);
  });

  it('renders the component - SERCQ SEND enabled, email added, app IO enabled', () => {
    appIO!.value = IOAllowedValues.ENABLED;
    const { queryByTestId } = render(<DomicileBanner source={ContactSource.HOME_NOTIFICHE} />, {
      preloadedState: {
        generalInfoState: {
          digitalAddresses: [sercqSendDefault, emailDefault, appIO],
          domicileBannerOpened: true,
        },
      },
    });
    const dialog = queryByTestId('addDomicileBanner');
    expect(dialog).not.toBeInTheDocument();
  });

  it('clicks on the close button', () => {
    const { getByTestId, queryByTestId } = render(
      <DomicileBanner source={ContactSource.HOME_NOTIFICHE} />
    );
    const closeButton = getByTestId('CloseIcon');
    fireEvent.click(closeButton);
    const dialog = queryByTestId('addDomicileBanner');
    expect(dialog).toBeNull();
  });
});
