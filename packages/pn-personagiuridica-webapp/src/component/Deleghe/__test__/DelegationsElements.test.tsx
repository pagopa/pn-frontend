import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { testAutocomplete } from '@pagopa-pn/pn-commons/src/test-utils';

import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  ACCEPT_DELEGATION,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
  UPDATE_DELEGATION,
} from '../../../api/delegations/delegations.routes';
import { DelegationStatus } from '../../../models/Deleghe';
import { AcceptButton, Menu, OrganizationsList } from '../DelegationsElements';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const actionCbk = jest.fn();

describe('DelegationElements', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
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

  it('opens the delegate Menu', () => {
    const { queryByTestId, getByTestId } = render(<Menu menuType="delegates" id="111" />);
    const menuIcon = getByTestId('delegationMenuIcon');
    const closedMenu = queryByTestId('delegationMenu');
    expect(closedMenu).toBeNull();
    fireEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    expect(menu).toHaveTextContent(/deleghe.revoke/i);
    expect(menu).toHaveTextContent(/deleghe.show/i);
  });

  it('opens the delegator Menu', () => {
    const { queryByTestId, getByTestId } = render(<Menu menuType="delegators" id="111" />);
    const menuIcon = getByTestId('delegationMenuIcon');
    const closedMenu = queryByTestId('delegationMenu');
    expect(closedMenu).toBeNull();
    fireEvent.click(menuIcon);
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
    await waitFor(() => fireEvent.mouseOver(organizationsList));
    await waitFor(() => expect(screen.getByText(/Malpensa/i)).toBeInTheDocument());
  });

  it('renders the AcceptButton - open the modal', async () => {
    const { container, getByTestId } = render(
      <AcceptButton id="1" name="test" onAccept={actionCbk} />
    );
    expect(container).toHaveTextContent(/deleghe.accept/i);
    const button = getByTestId('acceptButton');
    fireEvent.click(button);
    const codeDialog = await waitFor(() => screen.getByTestId('codeDialog'));
    expect(codeDialog).toBeInTheDocument();
  });

  it('renders the AcceptButton - close the modal', async () => {
    const { container, getByTestId } = render(
      <AcceptButton id="1" name="test" onAccept={actionCbk} />
    );
    expect(container).toHaveTextContent(/deleghe.accept/i);
    const button = getByTestId('acceptButton');
    fireEvent.click(button);
    const codeDialog = await waitFor(() => screen.getByTestId('codeDialog'));
    expect(codeDialog).toBeInTheDocument();
    const cancelButton = getByTestId('codeCancelButton');
    fireEvent.click(cancelButton);
    await waitFor(() => expect(codeDialog).not.toBeInTheDocument());
    expect(actionCbk).not.toBeCalled();
  });

  it('renders the AcceptButton - accept the delegation', async () => {
    const groups = [
      { id: 'group-1', name: 'Group 1', status: 'ACTIVE' },
      { id: 'group-2', name: 'Group 2', status: 'ACTIVE' },
    ];
    mock.onPatch(ACCEPT_DELEGATION('4')).reply(204);
    const { container, getByTestId } = render(
      <AcceptButton id="4" name="test" onAccept={actionCbk} />,
      {
        preloadedState: {
          delegationsState: {
            groups,
            delegations: {
              delegators: arrayOfDelegators,
            },
          },
        },
      }
    );
    expect(container).toHaveTextContent(/deleghe.accept/i);
    const button = getByTestId('acceptButton');
    fireEvent.click(button);
    const codeDialog = await waitFor(() => screen.getByTestId('codeDialog'));
    expect(codeDialog).toBeInTheDocument();
    const codeConfirmButton = within(codeDialog).getByTestId('codeConfirmButton');
    expect(codeConfirmButton).toBeDisabled();
    // fill the code
    const codeInputs = codeDialog.querySelectorAll('input');
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    expect(codeConfirmButton).toBeEnabled();
    // got to next step
    fireEvent.click(codeConfirmButton);
    const groupDialog = await waitFor(() => screen.getByTestId('groupDialog'));
    expect(groupDialog).toBeInTheDocument();
    // select groups to associate
    const associateGroupRadio = await waitFor(() =>
      within(groupDialog).getByTestId('associate-group')
    );
    fireEvent.click(associateGroupRadio);
    await testAutocomplete(groupDialog, 'groups', groups, true, 1);
    const groupConfirmButton = within(groupDialog).getByTestId('groupConfirmButton');
    fireEvent.click(groupConfirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain(ACCEPT_DELEGATION('4'));
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        groups: ['group-2'],
        verificationCode: '01234',
      });
    });
    expect(actionCbk).toBeCalledTimes(1);
  });

  it('check verificationCode for delegates', async () => {
    const verificationCode = '123456';
    const { getByTestId } = render(
      <Menu
        menuType="delegates"
        id="111"
        row={{ id: 'row-id', name: 'Mario Rossi', verificationCode }}
      />
    );
    const menuIcon = getByTestId('delegationMenuIcon');

    fireEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const show = menu.querySelectorAll('[role="menuitem"]')[0];
    fireEvent.click(show);
    const showDialog = await waitFor(() => screen.getByTestId('codeDialog'));
    const codeInputs = showDialog?.querySelectorAll('input');
    const arrayOfVerificationCode = verificationCode.split('');
    codeInputs?.forEach((input, index) => {
      expect(input).toHaveValue(arrayOfVerificationCode[index]);
    });
    const cancelButton = within(showDialog).getByTestId('codeCancelButton');
    fireEvent.click(cancelButton!);
    await waitFor(() => {
      expect(showDialog).not.toBeInTheDocument();
    });
  });

  it('check revoke for delegatates', async () => {
    mock.onPatch(REVOKE_DELEGATION('111')).reply(204);
    const { getByTestId } = render(
      <Menu
        menuType="delegates"
        id="111"
        row={{ id: 'row-id', name: 'Mario Rossi' }}
        onAction={actionCbk}
      />
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    fireEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const revoke = menu.querySelectorAll('[role="menuitem"]')[1];
    fireEvent.click(revoke);
    const showDialog = await waitFor(() => screen.getByTestId('dialogStack'));
    const revokeButton = within(showDialog).getAllByTestId('dialogAction')[1];
    fireEvent.click(revokeButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain('mandate/api/v1/mandate/111/revoke');
      expect(showDialog).not.toBeInTheDocument();
    });
    expect(actionCbk).toBeCalledTimes(1);
  });

  it('check close confimationDialog', async () => {
    const { getByTestId } = render(
      <Menu menuType="delegates" id="111" row={{ id: 'row-id', name: 'Mario Rossi' }} />
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    fireEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const revoke = menu.querySelectorAll('[role="menuitem"]')[1];
    fireEvent.click(revoke);
    const showDialog = await waitFor(() => screen.getByTestId('dialogStack'));
    const cancelButton = within(showDialog).getAllByTestId('dialogAction')[0];
    fireEvent.click(cancelButton!);
    await waitFor(() => {
      expect(showDialog).not.toBeInTheDocument();
    });
  });

  it('check reject for delegator', async () => {
    mock.onPatch(REJECT_DELEGATION('111')).reply(204);
    const { getByTestId } = render(
      <Menu menuType="delegators" id="111" row={{ id: 'row-id', name: 'Mario Rossi' }} />
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    fireEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const reject = menu.querySelectorAll('[role="menuitem"]')[0];
    fireEvent.click(reject);
    const showDialog = await waitFor(() => screen.getByTestId('dialogStack'));
    const rejectButton = within(showDialog).getAllByTestId('dialogAction')[1];
    fireEvent.click(rejectButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain('mandate/api/v1/mandate/111/reject');
      expect(showDialog).not.toBeInTheDocument();
    });
  });

  it("doesn't show the update button - delegator", async () => {
    const { getByTestId } = render(
      <Menu
        menuType="delegators"
        id="111"
        row={{ id: 'row-id', name: 'Mario Rossi', status: DelegationStatus.ACTIVE }}
      />
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    fireEvent.click(menuIcon);
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
        row={{
          id: 'row-id',
          name: 'Mario Rossi',
          status: DelegationStatus.ACTIVE,
          groups: [groups[1]],
        }}
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
    fireEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const menuItems = menu.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    const updateButton = menuItems[1];
    fireEvent.click(updateButton);
    const updateDialog = await waitFor(() => screen.getByTestId('groupDialog'));
    expect(updateDialog).toBeInTheDocument();
    const cancelButton = getByTestId('groupCancelButton');
    fireEvent.click(cancelButton);
    await waitFor(() => expect(updateDialog).not.toBeInTheDocument());
    expect(actionCbk).not.toBeCalled();
  });

  it('update groups - delegator', async () => {
    const groups = [
      { id: 'group-1', name: 'Group 1', status: 'ACTIVE' },
      { id: 'group-2', name: 'Group 2', status: 'ACTIVE' },
      { id: 'group-3', name: 'Group 3', status: 'ACTIVE' },
    ];
    mock.onPatch(UPDATE_DELEGATION('4')).reply(204);
    const { getByTestId } = render(
      <Menu
        menuType="delegators"
        id="4"
        row={{
          id: 'row-id',
          name: 'Mario Rossi',
          status: DelegationStatus.ACTIVE,
          groups: [groups[1]],
        }}
        onAction={actionCbk}
      />,
      {
        preloadedState: {
          delegationsState: {
            groups,
            delegations: {
              delegators: arrayOfDelegators,
            },
          },
        },
      }
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    fireEvent.click(menuIcon);
    const menu = getByTestId('delegationMenu');
    const menuItems = menu.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    const updateButton = menuItems[1];
    fireEvent.click(updateButton);
    const updateDialog = await waitFor(() => screen.getByTestId('groupDialog'));
    expect(updateDialog).toBeInTheDocument();
    await testAutocomplete(updateDialog, 'groups', groups, true, 2);
    const groupConfirmButton = within(updateDialog).getByTestId('groupConfirmButton');
    fireEvent.click(groupConfirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain('/mandate/api/v1/mandate/4/update');
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        groups: ['group-2', 'group-3'],
      });
    });
    expect(actionCbk).toBeCalledTimes(1);
  });
});
