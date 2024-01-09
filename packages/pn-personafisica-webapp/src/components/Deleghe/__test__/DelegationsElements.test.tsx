import { vi } from 'vitest';

import { fireEvent, render, screen, waitFor } from '../../../__test__/test-utils';
import { AcceptButton, Menu, OrganizationsList } from '../DelegationsElements';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockOpenCodeModalHandler = vi.fn();

describe('DelegationElements', async () => {
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const testUtils = await import('../../../__test__/test-utils');

  it('renders the Menu closed', () => {
    const { queryByTestId } = render(<Menu />);
    const menuIcon = queryByTestId('delegationMenuIcon');
    const closedMenu = queryByTestId('delegationMenu');
    expect(menuIcon).not.toBeNull();
    expect(closedMenu).toBeNull();
  });

  it('opens the delegate Menu and clicks on menu voices', async () => {
    const { getByTestId, queryByTestId } = render(
      <Menu
        menuType={'delegates'}
        id={'111'}
        setCodeModal={mockOpenCodeModalHandler}
        name="mocked-name"
        verificationCode="01234"
      />
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    const closedMenu = queryByTestId('delegationMenu');
    expect(closedMenu).toBeNull();
    fireEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    expect(menu).toHaveTextContent(/deleghe.revoke/i);
    expect(menu).toHaveTextContent(/deleghe.show/i);
    const showCode = getByTestId('menuItem-showCode');
    fireEvent.click(showCode);
    expect(mockOpenCodeModalHandler).toBeCalledTimes(1);
    expect(mockOpenCodeModalHandler).toBeCalledWith({
      open: true,
      name: 'mocked-name',
      code: '01234',
    });
    // reopen menu
    fireEvent.click(menuIcon);
    const revokeDelegate = await waitFor(() => getByTestId('menuItem-revokeDelegate'));
    fireEvent.click(revokeDelegate);
    await waitFor(() => {
      expect(testUtils.testStore.getState().delegationsState.modalState).toStrictEqual({
        id: '111',
        open: true,
        type: 'delegates',
      });
    });
  });

  it('opens the delegator Menu and clicks on menu voices', async () => {
    const { getByTestId, queryByTestId } = render(<Menu menuType={'delegators'} id={'111'} />);
    const menuIcon = getByTestId('delegationMenuIcon');
    const closedMenu = queryByTestId('delegationMenu');
    expect(closedMenu).toBeNull();
    fireEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    expect(menu).toHaveTextContent(/deleghe.reject/i);
    const rejectDelegator = getByTestId('menuItem-rejectDelegator');
    fireEvent.click(rejectDelegator);
    await waitFor(() => {
      expect(testUtils.testStore.getState().delegationsState.modalState).toStrictEqual({
        id: '111',
        open: true,
        type: 'delegators',
      });
    });
  });

  it('renders the OrganizationList with all notifications label', () => {
    const { container } = render(<OrganizationsList organizations={[]} />);
    expect(container).toHaveTextContent(/deleghe.table.allNotifications/i);
  });

  it('renders the OrganizationList with multiple organization', () => {
    const { container } = render(
      <OrganizationsList organizations={['Bollate', 'Comune di Milano', 'Comune di Palermo']} />
    );
    expect(container).toHaveTextContent(/deleghe.table.notificationsFrom/i);
    expect(container).toHaveTextContent(/Bollate/i);
    expect(container).toHaveTextContent(/Comune di Milano/i);
    expect(container).toHaveTextContent(/Comune di Palermo/i);
  });

  it('renders the OrganizationList with multiple organizations and visibleItems set to 3', async () => {
    const { container, getByTestId } = render(
      <OrganizationsList
        organizations={['Bollate', 'Milano', 'Abbiategrasso', 'Malpensa']}
        visibleItems={3}
      />
    );
    const organizationsList = getByTestId('custom-tooltip-indicator');
    expect(container).toHaveTextContent(/deleghe.table.notificationsFrom/i);
    expect(container).toHaveTextContent(/Bollate/i);
    expect(container).toHaveTextContent(/Milano/i);
    expect(container).toHaveTextContent(/Abbiategrasso/i);
    expect(container).toHaveTextContent(/\+1/i);
    expect(container).not.toHaveTextContent(/Malpesa/i);
    fireEvent.mouseOver(organizationsList);
    await waitFor(() => expect(screen.getByText(/Malpensa/i)).toBeInTheDocument());
  });

  it('renders the AcceptButton and clicks on button', async () => {
    const { container, getByTestId } = render(<AcceptButton id={'111'} name={'test'} />);
    expect(container).toHaveTextContent(/deleghe.accept/i);
    const acceptButton = getByTestId('acceptButton');
    fireEvent.click(acceptButton);
    await waitFor(() => {
      expect(testUtils.testStore.getState().delegationsState.acceptModalState).toStrictEqual({
        id: '111',
        open: true,
        name: 'test',
        error: false,
      });
    });
  });
});
