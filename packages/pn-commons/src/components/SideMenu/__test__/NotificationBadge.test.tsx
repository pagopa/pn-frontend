import { render } from '../../../test-utils';
import NotificationBadge from '../NotificationBadge';

describe('NotificationBadge', () => {
  it('render component with notifications', () => {
    const { getByTestId } = render(<NotificationBadge numberOfNotification={5} />);
    const notification = getByTestId('notifications');
    expect(notification).toHaveTextContent('5');
  });

  it('render component without notifications', () => {
    const { getByTestId } = render(<NotificationBadge numberOfNotification={0} />);
    const notification = getByTestId('notifications');
    expect(notification).not.toHaveTextContent('0');
  });
});
