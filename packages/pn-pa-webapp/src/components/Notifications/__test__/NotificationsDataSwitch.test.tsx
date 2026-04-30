import { vi } from 'vitest';

import { formatDate, getNotificationStatusInfos } from '@pagopa-pn/pn-commons';
import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';

import { notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import NotificationsDataSwitch from '../NotificationsDataSwitch';

const data = {
  id: '0',
  ...notificationsToFe.resultsPage[0],
};

describe('NotificationsDataSwitch Component', () => {
  const originalMatchMedia = globalThis.matchMedia;
  const originalResizeObserver = globalThis.ResizeObserver;

  beforeAll(() => {
    globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  afterAll(() => {
    globalThis.matchMedia = originalMatchMedia;
    globalThis.ResizeObserver = originalResizeObserver;
  });

  it('renders component - sentAt', () => {
    const { container } = render(<NotificationsDataSwitch data={data} type="sentAt" />);
    const regexp = new RegExp(`^${formatDate(data.sentAt)}$`, 'ig');
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

  it('renders component - group', () => {
    const { container } = render(<NotificationsDataSwitch data={data} type="group" />);
    const regexp = new RegExp(`^${data.group}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - group - mobile', () => {
    globalThis.matchMedia = createMatchMedia(800);
    const { container } = render(<NotificationsDataSwitch data={data} type="group" />);
    const regexp = new RegExp(`^${data.group}$`, 'ig');
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
