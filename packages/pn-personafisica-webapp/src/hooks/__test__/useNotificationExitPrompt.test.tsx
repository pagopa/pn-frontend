import { RouterProvider, createMemoryRouter, useLocation, useNavigate } from 'react-router-dom';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useNotificationExitPrompt } from '../useNotificationExitPrompt';

type PromptTestComponentProps = {
  when?: boolean;
  route?: string;
};

const PromptTestComponent = ({ when = true, route = '/notifiche' }: PromptTestComponentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isBlocked, confirmNavigation, cancelNavigation] = useNotificationExitPrompt({
    when,
    route,
  });

  return (
    <div>
      <div data-testid="current-pathname">{location.pathname}</div>
      <div data-testid="blocked-state">{String(isBlocked)}</div>

      <button onClick={() => navigate('/notifiche')}>Go notifications</button>
      <button onClick={() => navigate('/other')}>Go other</button>
      <button onClick={confirmNavigation}>Confirm</button>
      <button onClick={cancelNavigation}>Cancel</button>
    </div>
  );
};

const renderComponent = (props?: PromptTestComponentProps) => {
  const router = createMemoryRouter(
    [
      {
        path: '/detail',
        element: <PromptTestComponent {...props} />,
      },
      {
        path: '/notifiche',
        element: <div>Notifications page</div>,
      },
      {
        path: '/other',
        element: <div>Other page</div>,
      },
    ],
    {
      initialEntries: ['/detail'],
      initialIndex: 0,
    }
  );

  const user = userEvent.setup();

  render(<RouterProvider router={router} />);

  return { router, user };
};

describe('useNotificationExitPrompt', () => {
  it('should start as unblocked', () => {
    renderComponent();

    expect(screen.getByTestId('current-pathname')).toHaveTextContent('/detail');
    expect(screen.getByTestId('blocked-state')).toHaveTextContent('false');
  });

  it('should block navigation to the configured route when enabled', async () => {
    const { router, user } = renderComponent({
      when: true,
      route: '/notifiche',
    });

    await user.click(screen.getByRole('button', { name: 'Go notifications' }));

    await waitFor(() => {
      expect(screen.getByTestId('blocked-state')).toHaveTextContent('true');
    });

    expect(screen.getByTestId('current-pathname')).toHaveTextContent('/detail');
    expect(router.state.location.pathname).toBe('/detail');
    expect(screen.queryByText('Notifications page')).not.toBeInTheDocument();
  });

  it('should proceed to the blocked route after confirmNavigation', async () => {
    const { router, user } = renderComponent({
      when: true,
      route: '/notifiche',
    });

    await user.click(screen.getByRole('button', { name: 'Go notifications' }));

    await waitFor(() => {
      expect(screen.getByTestId('blocked-state')).toHaveTextContent('true');
    });

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/notifiche');
    });

    expect(screen.getByText('Notifications page')).toBeInTheDocument();
  });

  it('should stay on the current page after cancelNavigation', async () => {
    const { router, user } = renderComponent({
      when: true,
      route: '/notifiche',
    });

    await user.click(screen.getByRole('button', { name: 'Go notifications' }));

    await waitFor(() => {
      expect(screen.getByTestId('blocked-state')).toHaveTextContent('true');
    });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.getByTestId('blocked-state')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('current-pathname')).toHaveTextContent('/detail');
    expect(router.state.location.pathname).toBe('/detail');
    expect(screen.queryByText('Notifications page')).not.toBeInTheDocument();
  });

  it('should not block navigation to the configured route when disabled', async () => {
    const { router, user } = renderComponent({
      when: false,
      route: '/notifiche',
    });

    await user.click(screen.getByRole('button', { name: 'Go notifications' }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/notifiche');
    });

    expect(screen.getByText('Notifications page')).toBeInTheDocument();
  });

  it('should not block navigation when destination does not match the configured route', async () => {
    const { router, user } = renderComponent({
      when: true,
      route: '/notifiche',
    });

    await user.click(screen.getByRole('button', { name: 'Go other' }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/other');
    });

    expect(screen.getByText('Other page')).toBeInTheDocument();
  });
});
