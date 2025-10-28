import { vi } from 'vitest';

import { NotificationStatus } from '../../../models/NotificationStatus';
import { createMatchMedia, fireEvent, render } from '../../../test-utils';
import { formatDate } from '../../../utility/date.utility';
import { getNotificationStatusInfos } from '../../../utility/notification.utility';
import NotificationsDataSwitch from '../NotificationsDataSwitch';

const data = {
  id: '0',
  iun: 'DAPQ-LWQV-DKQH-202308-A-1',
  paProtocolNumber: 'TA-FFSMRC-20230823-2',
  sender: 'Comune di Palermo',
  sentAt: '2023-08-23T07:38:49.601270863Z',
  subject: 'Pagamento rata IMU',
  notificationStatus: NotificationStatus.ACCEPTED,
  recipients: ['CLMCST42R12D969Z', 'DRCGNN12A46A326K', 'LVLDAA85T50G702B'],
  group: '6467344676f10c7617353c90',
};

describe('NotificationsDataSwitch Component', () => {
  const original = window.matchMedia;

  afterAll(() => {
    window.matchMedia = original;
  });

  it('renders component - badge', () => {
    const { getByTestId } = render(<NotificationsDataSwitch data={data} type="badge" />);
    const badge = getByTestId('new-notification-badge');
    expect(badge).toBeInTheDocument();
  });

  it('renders component - sentAt', () => {
    const { container } = render(<NotificationsDataSwitch data={data} type="sentAt" />);
    const regexp = new RegExp(`^${formatDate(data.sentAt)}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - sentAt - mobile', () => {
    window.matchMedia = createMatchMedia(800);
    const { container, getByTestId } = render(
      <NotificationsDataSwitch data={data} type="sentAt" />
    );
    const regexp = new RegExp(`^${formatDate(data.sentAt)}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const badge = getByTestId('new-notification-badge');
    expect(badge).toBeInTheDocument();
  });

  it('renders component - sentAt and viewed - mobile', () => {
    const { container, queryByTestId } = render(
      <NotificationsDataSwitch
        data={{ ...data, notificationStatus: NotificationStatus.VIEWED }}
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
    const { container } = render(<NotificationsDataSwitch data={data} type="sender" />);
    const regexp = new RegExp(`^${data.sender}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - subject', () => {
    const { container } = render(<NotificationsDataSwitch data={data} type="subject" />);
    const regexp = new RegExp(`^${data.subject}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - iun', () => {
    const { container } = render(<NotificationsDataSwitch data={data} type="iun" />);
    const regexp = new RegExp(`^${data.iun}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - notificationStatus', () => {
    const { label } = getNotificationStatusInfos(data.notificationStatus, {
      recipients: data.recipients,
    });
    const { container } = render(<NotificationsDataSwitch data={data} type="notificationStatus" />);
    const regexp = new RegExp(`^${label}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - recipients', () => {
    const { container } = render(<NotificationsDataSwitch data={data} type="recipients" />);
    const regexp = new RegExp(`^${data.recipients.join('')}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - action', () => {
    const clickFn = vi.fn();
    const { getByTestId } = render(
      <NotificationsDataSwitch data={data} type="action" handleRowClick={clickFn} />
    );
    const button = getByTestId('goToNotificationDetail');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(clickFn).toHaveBeenCalledTimes(1);
  });
});
