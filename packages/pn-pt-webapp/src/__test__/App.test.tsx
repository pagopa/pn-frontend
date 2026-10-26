import { vi } from 'vitest';

import App from '../App';
import { institutionsDTO } from '../__mocks__/User.mock';
import { DASHBOARD, GROUPS, HOME, USERS } from '../navigation/routes.const';
import { fireEvent, render, screen, waitFor, within } from './test-utils';

describe('App', () => {
  it('renders header, side menu, footer and home page', () => {
    const { container } = render(<App />);
    // header
    expect(container).toHaveTextContent(/PagoPA S.p.A.AssistenzaEsci/i);
    // only the party of the user is shown, without the party switch
    expect(container).toHaveTextContent(institutionsDTO.name);
    expect(
      screen.queryByRole('button', { name: new RegExp(institutionsDTO.name) })
    ).not.toBeInTheDocument();
    // side menu
    const sideMenu = screen.getByTestId('sideMenu');
    expect(within(sideMenu).getByText('menu.institutions')).toBeInTheDocument();
    expect(within(sideMenu).getByText('menu.users')).toBeInTheDocument();
    expect(within(sideMenu).getByText('menu.groups')).toBeInTheDocument();
    // footer
    expect(container).toHaveTextContent(/PagoPA S.p.A. — società per azioni/i);
    // page content
    expect(screen.getByTestId('institutionsPage')).toBeInTheDocument();
  });

  it('opens SelfCare users and groups pages from the side menu', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<App />);
    fireEvent.click(screen.getByTestId('sideMenuItem-menu.users'));
    expect(windowOpenSpy).toHaveBeenCalledWith(USERS(institutionsDTO.id, 'it'));
    fireEvent.click(screen.getByTestId('sideMenuItem-menu.groups'));
    expect(windowOpenSpy).toHaveBeenCalledWith(GROUPS(institutionsDTO.id, 'it'));
    windowOpenSpy.mockRestore();
  });

  it('renders the not found page for an unknown route and goes back to home', () => {
    const { router } = render(<App />, { route: '/unknown-route' });
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
    expect(screen.queryByTestId('institutionsPage')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('not-found-back-button'));
    expect(router.state.location.pathname).toBe(HOME);
    expect(screen.getByTestId('institutionsPage')).toBeInTheDocument();
  });

  it('opens SelfCare reserved area from the products switch', async () => {
    const assignFn = vi.fn();
    vi.stubGlobal('location', { href: '', assign: assignFn });
    const { container } = render(<App />);
    const headers = container.querySelectorAll('.MuiContainer-root');
    const productButton = headers[1].querySelector('[role="button"]');
    fireEvent.click(productButton!);
    const productDropdown = await waitFor(() => screen.getByRole('presentation'));
    fireEvent.click(within(productDropdown).getByText('header.reserved-area'));
    expect(assignFn).toHaveBeenCalledWith(DASHBOARD(institutionsDTO.id, 'it'));
    vi.unstubAllGlobals();
  });
});
