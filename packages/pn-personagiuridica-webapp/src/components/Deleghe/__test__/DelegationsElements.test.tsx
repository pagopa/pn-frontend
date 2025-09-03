import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { Row } from '@pagopa-pn/pn-commons';
import { testAutocomplete } from '@pagopa-pn/pn-commons/src/test-utils';
import userEvent from '@testing-library/user-event';

import { mandatesByDelegate } from '../../../__mocks__/Delegations.mock';
import { render, screen, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { DelegationColumnData, DelegationStatus } from '../../../models/Deleghe';
import { AcceptButton, Menu, OrganizationsList } from '../DelegationsElements';

const actionCbk = vi.fn();

describe('DelegationElements', async () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders the Menu closed', () => {
    const { queryByTestId, getByTestId } = render(<Menu menuType="delegates" id="111" />);
    const menuIcon = getByTestId('delegationMenuIcon');
    const closedMenu = queryByTestId('delegationMenu');
    expect(menuIcon).not.toBeNull();
    expect(closedMenu).toBeNull();
  });

  it('opens the delegate Menu', async () => {
    const { queryByTestId, getByTestId } = render(<Menu menuType="delegates" id="111" />);
    const menuIcon = getByTestId('delegationMenuIcon');
    const closedMenu = queryByTestId('delegationMenu');
    expect(closedMenu).toBeNull();
    await userEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    expect(menu).toHaveTextContent(/deleghe.revoke/i);
    expect(menu).toHaveTextContent(/deleghe.show/i);
  });

  it('opens the delegator Menu', async () => {
    const { queryByTestId, getByTestId } = render(<Menu menuType="delegators" id="111" />);
    const menuIcon = getByTestId('delegationMenuIcon');
    const closedMenu = queryByTestId('delegationMenu');
    expect(closedMenu).toBeNull();
    await userEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    expect(menu).toHaveTextContent(/deleghe.reject/i);
  });

  it('renders the OrganizationList with all notifications label', () => {
    const { container } = render(<OrganizationsList organizations={[]} />);
    expect(container).toHaveTextContent(/deleghe.table.allNotifications/i);
  });

  it('renders the OrganizationList with one organization', () => {
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
    await userEvent.hover(organizationsList);
    await waitFor(() => expect(screen.getByText(/Malpensa/i)).toBeInTheDocument());
  });

  it('renders the AcceptButton - open the modal', async () => {
    const { container, getByTestId } = render(
      <AcceptButton id="1" name="test" onAccept={actionCbk} />
    );
    expect(container).toHaveTextContent(/deleghe.accept/i);
    const button = getByTestId('acceptButton');
    await userEvent.click(button);
    const codeDialog = await waitFor(() => screen.getByTestId('codeDialog'));
    expect(codeDialog).toBeInTheDocument();
  });

  it('renders the AcceptButton - close the modal', async () => {
    const { container, getByTestId } = render(
      <AcceptButton id="1" name="test" onAccept={actionCbk} />
    );
    expect(container).toHaveTextContent(/deleghe.accept/i);
    const button = getByTestId('acceptButton');
    await userEvent.click(button);
    const codeDialog = await waitFor(() => screen.getByTestId('codeDialog'));
    expect(codeDialog).toBeInTheDocument();
    const cancelButton = getByTestId('codeCancelButton');
    await userEvent.click(cancelButton);
    await waitFor(() => expect(codeDialog).not.toBeInTheDocument());
    expect(actionCbk).not.toHaveBeenCalled();
  });

  it('renders the AcceptButton - accept the delegation', async () => {
    const groups = [
      { id: 'group-1', name: 'Group 1', status: 'ACTIVE' },
      { id: 'group-2', name: 'Group 2', status: 'ACTIVE' },
    ];
    mock.onPatch(`/bff/v1/mandate/4/accept`).reply(204);
    const { container, getByTestId } = render(
      <AcceptButton id="4" name="test" onAccept={actionCbk} />,
      {
        preloadedState: {
          delegationsState: {
            groups,
            delegations: {
              delegators: mandatesByDelegate,
            },
          },
        },
      }
    );
    expect(container).toHaveTextContent(/deleghe.accept/i);
    const button = getByTestId('acceptButton');
    await userEvent.click(button);
    const codeDialog = await waitFor(() => screen.getByTestId('codeDialog'));
    expect(codeDialog).toBeInTheDocument();
    const codeConfirmButton = within(codeDialog).getByTestId('codeConfirmButton');
    expect(codeConfirmButton).toBeEnabled();
    // fill the code
    const textbox = within(codeDialog).getByRole('textbox');
    textbox.focus();
    await userEvent.keyboard('01234');
    expect(codeConfirmButton).toBeEnabled();
    // got to next step
    await userEvent.click(codeConfirmButton);
    const groupDialog = await waitFor(() => screen.getByTestId('groupDialog'));
    expect(groupDialog).toBeInTheDocument();
    // select groups to associate
    const associateGroupRadio = await waitFor(() =>
      within(groupDialog).getByTestId('associate-group')
    );
    await userEvent.click(associateGroupRadio);
    await testAutocomplete(groupDialog, 'groups', groups, true, 1);
    const groupConfirmButton = within(groupDialog).getByTestId('groupConfirmButton');
    await userEvent.click(groupConfirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain(`/bff/v1/mandate/4/accept`);
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        groups: ['group-2'],
        verificationCode: '01234',
      });
    });
    expect(actionCbk).toHaveBeenCalledTimes(1);
  });

  it('check verificationCode for delegates', async () => {
    const verificationCode = '123456';
    const { getByTestId } = render(
      <Menu
        menuType="delegates"
        id="111"
        row={{ id: 'row-id', name: 'Mario Rossi', verificationCode } as Row<DelegationColumnData>}
      />
    );
    const menuIcon = getByTestId('delegationMenuIcon');

    await userEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const show = menu.querySelectorAll('[role="menuitem"]')[0];
    await userEvent.click(show);
    const showDialog = await waitFor(() => screen.getByTestId('codeDialog'));
    const textbox = within(showDialog).getByRole('textbox');
    // since CodeModal truncates to codeLength (default 5), check only first 5 chars
    expect(textbox).toHaveValue(verificationCode.slice(0, 5));
    const cancelButton = within(showDialog).getByTestId('codeCancelButton');
    await userEvent.click(cancelButton);
    await waitFor(() => {
      expect(showDialog).not.toBeInTheDocument();
    });
  });

  it('check revoke for delegatates', async () => {
    mock.onPatch('/bff/v1/mandate/111/revoke').reply(204);
    const { getByTestId } = render(
      <Menu
        menuType="delegates"
        id="111"
        row={{ id: 'row-id', name: 'Mario Rossi' } as Row<DelegationColumnData>}
        onAction={actionCbk}
      />
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    await userEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const revoke = menu.querySelectorAll('[role="menuitem"]')[1];
    await userEvent.click(revoke);
    const showDialog = await waitFor(() => screen.getByTestId('confirmationDialog'));
    const confirmButton = within(showDialog).getByTestId('confirmButton');
    await userEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain('/bff/v1/mandate/111/revoke');
      expect(showDialog).not.toBeInTheDocument();
    });
    expect(actionCbk).toHaveBeenCalledTimes(1);
  });

  it('check close confimationDialog', async () => {
    const { getByTestId } = render(
      <Menu
        menuType="delegates"
        id="111"
        row={{ id: 'row-id', name: 'Mario Rossi' } as Row<DelegationColumnData>}
      />
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    await userEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const revoke = menu.querySelectorAll('[role="menuitem"]')[1];
    await userEvent.click(revoke);
    const showDialog = await waitFor(() => screen.getByTestId('confirmationDialog'));
    const cancelButton = within(showDialog).getByTestId('closeButton');
    await userEvent.click(cancelButton);
    await waitFor(() => {
      expect(showDialog).not.toBeInTheDocument();
    });
  });

  it('check reject for delegator', async () => {
    mock.onPatch('/bff/v1/mandate/111/reject').reply(204);
    const { getByTestId } = render(
      <Menu
        menuType="delegators"
        id="111"
        row={{ id: 'row-id', name: 'Mario Rossi' } as Row<DelegationColumnData>}
      />
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    await userEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const reject = menu.querySelectorAll('[role="menuitem"]')[0];
    await userEvent.click(reject);
    const showDialog = await waitFor(() => screen.getByTestId('confirmationDialog'));
    const confirmButton = within(showDialog).getByTestId('confirmButton');
    await userEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain('/bff/v1/mandate/111/reject');
      expect(showDialog).not.toBeInTheDocument();
    });
  });

  it("doesn't show the update button - delegator", async () => {
    const { getByTestId } = render(
      <Menu
        menuType="delegators"
        id="111"
        row={
          {
            id: 'row-id',
            name: 'Mario Rossi',
            status: DelegationStatus.ACTIVE,
          } as Row<DelegationColumnData>
        }
      />
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    await userEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const menuItems = menu.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(1);
  });

  it('shows the update button and modal - delegator', async () => {
    const groups = [
      { id: 'group-1', name: 'Group 1' },
      { id: 'group-2', name: 'Group 2' },
      { id: 'group-3', name: 'Group 3' },
    ];
    const { getByTestId } = render(
      <Menu
        menuType="delegators"
        id="111"
        row={
          {
            id: 'row-id',
            name: 'Mario Rossi',
            status: DelegationStatus.ACTIVE,
            groups: [groups[1]],
          } as Row<DelegationColumnData>
        }
      />,
      {
        preloadedState: {
          delegationsState: {
            groups,
          },
        },
      }
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    await userEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const menuItems = menu.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    const updateButton = menuItems[1];
    await userEvent.click(updateButton);
    const updateDialog = await waitFor(() => screen.getByTestId('groupDialog'));
    expect(updateDialog).toBeInTheDocument();
    const cancelButton = getByTestId('groupCancelButton');
    await userEvent.click(cancelButton);
    await waitFor(() => expect(updateDialog).not.toBeInTheDocument());
    expect(actionCbk).not.toHaveBeenCalled();
  });

  it('update groups - delegator', async () => {
    const groups = [
      { id: 'group-1', name: 'Group 1', status: 'ACTIVE' },
      { id: 'group-2', name: 'Group 2', status: 'ACTIVE' },
      { id: 'group-3', name: 'Group 3', status: 'ACTIVE' },
    ];
    mock.onPatch(`/bff/v1/mandate/4/update`).reply(204);
    const { getByTestId } = render(
      <Menu
        menuType="delegators"
        id="4"
        row={
          {
            id: 'row-id',
            name: 'Mario Rossi',
            status: DelegationStatus.ACTIVE,
            groups: [groups[1]] as Array<{ id: string; name: string }>,
          } as Row<DelegationColumnData>
        }
        onAction={actionCbk}
      />,
      {
        preloadedState: {
          delegationsState: {
            groups,
            delegations: {
              delegators: mandatesByDelegate,
            },
          },
        },
      }
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    await userEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const menuItems = menu.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    const updateButton = menuItems[1];
    await userEvent.click(updateButton);
    const updateDialog = await waitFor(() => screen.getByTestId('groupDialog'));
    expect(updateDialog).toBeInTheDocument();
    await testAutocomplete(updateDialog, 'groups', groups, true, 2);
    const groupConfirmButton = within(updateDialog).getByTestId('groupConfirmButton');
    await userEvent.click(groupConfirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain(`/bff/v1/mandate/4/update`);
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        groups: ['group-2', 'group-3'],
      });
    });
    expect(actionCbk).toHaveBeenCalledTimes(1);
  });
});
