import { vi } from 'vitest';

import App from '../App';
import { institutionsDTO } from '../__mocks__/User.mock';
import { GROUPS, USERS } from '../navigation/routes.const';
import { fireEvent, render, screen, within } from './test-utils';

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
});
