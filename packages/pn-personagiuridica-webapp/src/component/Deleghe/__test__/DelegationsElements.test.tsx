import { fireEvent } from '@testing-library/react';
import { render } from '../../../__test__/test-utils';
import { AcceptButton, Menu, OrganizationsList } from '../DelegationsElements';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('DelegationElements', () => {
  it('renders the Menu closed', () => {
    const result = render(<Menu />);
    const menuIcon = result.queryByTestId('delegationMenuIcon');
    const closedMenu = result.queryByTestId('delegationMenu');

    expect(menuIcon).not.toBeNull();
    expect(closedMenu).toBeNull();
  });

  it('opens the delegate Menu', () => {
    const result = render(<Menu menuType={'delegates'} id={'111'} />);
    const menuIcon = result.getByTestId('delegationMenuIcon');
    const closedMenu = result.queryByTestId('delegationMenu');

    expect(closedMenu).toBeNull();

    fireEvent.click(menuIcon);
    const menu = result.getByTestId('delegationMenu');

    expect(menu).toHaveTextContent(/deleghe.revoke/i);
    expect(menu).toHaveTextContent(/deleghe.show/i);
  });

  it('opens the delegator Menu', () => {
    const result = render(<Menu menuType={'delegators'} id={'111'} />);
    const menuIcon = result.getByTestId('delegationMenuIcon');
    const closedMenu = result.queryByTestId('delegationMenu');

    expect(closedMenu).toBeNull();

    fireEvent.click(menuIcon);
    const menu = result.getByTestId('delegationMenu');

    expect(menu).toHaveTextContent(/deleghe.reject/i);
  });

  it('renders the OrganizationList with all notifications label', () => {
    const result = render(<OrganizationsList organizations={[]} />);

    expect(result.container).toHaveTextContent(/deleghe.table.allNotifications/i);
  });

  it('renders the OrganizationList with one organization', () => {
    const result = render(<OrganizationsList organizations={['Bollate']} />);

    expect(result.container).toHaveTextContent(/deleghe.table.notificationsFrom/i);
    expect(result.container).toHaveTextContent(/Bollate/i);
  });

  it('renders the AcceptButton', () => {
    const result = render(<AcceptButton id={'1'} name={'test'} />);

    expect(result.container).toHaveTextContent(/deleghe.accept/i);
  });
});
