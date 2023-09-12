import React from 'react';

import { RenderResult, render } from '../../../test-utils';
import NotificationBadge from '../NotificationBadge';

describe('NotificationBadge', () => {
  let result: RenderResult | undefined;

  afterEach(() => {
    result = undefined;
  });

  it('render component with notifications', () => {
    result = render(<NotificationBadge numberOfNotification={5} />);
    const notification = result?.getByTestId('notifications');
    expect(notification).toHaveTextContent('5');
  });

  it('render component without notifications', () => {
    result = render(<NotificationBadge numberOfNotification={0} />);
    const notification = result?.getByTestId('notifications');
    expect(notification).not.toHaveTextContent('0');
  });
});
