import { render, screen } from '@testing-library/react';

import NotificationDetail from '../NotificationDetail.page';

describe('Notification Detail Page', () => {
  // TODO fix this test: something in pagination mock is wrong
  it('renders notification detail page', () => {
    render(
      <NotificationDetail />
    );
    expect(screen.getByRole('link')).toHaveTextContent(/Notifiche/i);
  });
});