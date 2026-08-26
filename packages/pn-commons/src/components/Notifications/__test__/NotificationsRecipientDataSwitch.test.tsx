import { vi } from 'vitest';

import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';

import { NotificationStatus } from '../../../models/NotificationStatus';
import { RecipientNotification } from '../../../models/Notifications';
import { Row } from '../../../models/PnTable';
import { createMatchMedia, fireEvent, render } from '../../../test-utils';
import { formatDate } from '../../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import NotificationsRecipientDataSwitch from '../NotificationsRecipientDataSwitch';

const data: Row<RecipientNotification> = {
  id: '0',
  iun: 'DAPQ-LWQV-DKQH-202308-A-1',
  paProtocolNumber: 'TA-FFSMRC-20230823-2',
  sender: 'Comune di Test 1',
  sentAt: '2023-08-23T07:38:49.601270863Z',
  subject: 'Pagamento rata IMU',
  notificationStatus: NotificationStatus.ACCEPTED,
  recipients: ['CLMCST42R12D969Z', 'DRCGNN12A46A326K', 'TSTUTN00A07A001G'],
  group: '6467344676f10c7617353c90',
  communicationType: 'LEGAL',
  isNewNotification: true,
};

describe('NotificationsRecipientDataSwitch Component', () => {
  const originalWatchMedia = window.matchMedia;
  const originalResizeObserver = globalThis.ResizeObserver;

  beforeAll(() => {
    globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  afterAll(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });

  afterAll(() => {
    window.matchMedia = originalWatchMedia;
  });

  it('renders component - badge - new notification', () => {
    const { getByTestId } = render(<NotificationsRecipientDataSwitch data={data} type="sentAt" />);
    const badge = getByTestId('new-notification-badge');
    expect(badge).toBeInTheDocument();
  });

  it('renders component - badge - already read notification', () => {
    const { queryByTestId } = render(
      <NotificationsRecipientDataSwitch
        data={{ ...data, isNewNotification: false }}
        type="sentAt"
      />
    );
    const badge = queryByTestId('new-notification-badge');
    expect(badge).not.toBeInTheDocument();
  });

  it('renders component - sentAt', () => {
    window.matchMedia = createMatchMedia(2000);
    const { container } = render(<NotificationsRecipientDataSwitch data={data} type="sentAt" />);
    const regexp = new RegExp(`^${formatDate(data.sentAt)}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - sentAt - mobile', () => {
    window.matchMedia = createMatchMedia(800);
    const { container, getByTestId } = render(
      <NotificationsRecipientDataSwitch data={data} type="sentAt" />
    );
    const regexp = new RegExp(`^${formatDate(data.sentAt)}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const badge = getByTestId('new-notification-badge');
    expect(badge).toBeInTheDocument();
  });

  it('renders component - sentAt and already read - mobile', () => {
    const { container, queryByTestId } = render(
      <NotificationsRecipientDataSwitch
        data={{ ...data, isNewNotification: false }}
        type="sentAt"
      />
    );
    const regexp = new RegExp(`^${formatDate(data.sentAt)}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const badge = queryByTestId('new-notification-badge');
    expect(badge).not.toBeInTheDocument();
  });

  it('renders component - sender', () => {
    window.matchMedia = createMatchMedia(2000);
    const { container } = render(<NotificationsRecipientDataSwitch data={data} type="sender" />);
    const regexp = new RegExp(`^${data.sender}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - subject - legal communication', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <NotificationsRecipientDataSwitch data={data} type="subject" />
      </ThemeProvider>
    );
    expect(container).toHaveTextContent(data.subject);
    const legalLabel = getLocalizedOrDefaultLabel('notifications', 'table.legal-value');
    expect(container).toHaveTextContent(legalLabel);
  });

  it('renders component - subject - informal communication (no legal tag)', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <NotificationsRecipientDataSwitch
          data={{ ...data, communicationType: 'INFORMAL' }}
          type="subject"
        />
      </ThemeProvider>
    );
    expect(container).toHaveTextContent(data.subject);
    const legalLabel = getLocalizedOrDefaultLabel('notifications', 'table.legal-value');
    expect(container).not.toHaveTextContent(legalLabel);
  });

  it('renders component - iun', () => {
    const { container } = render(<NotificationsRecipientDataSwitch data={data} type="iun" />);
    const regexp = new RegExp(`^${data.iun}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - recipients', () => {
    const { container } = render(
      <NotificationsRecipientDataSwitch data={data} type="recipients" />
    );
    const regexp = new RegExp(`^${data.recipients.join('')}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - action', () => {
    const clickFn = vi.fn();
    const { getByTestId } = render(
      <NotificationsRecipientDataSwitch data={data} type="action" handleRowClick={clickFn} />
    );
    const button = getByTestId('goToNotificationDetail');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(clickFn).toHaveBeenCalledTimes(1);
    expect(clickFn).toHaveBeenCalledWith(data.iun, data.communicationType, data.mandateId);
  });
});
