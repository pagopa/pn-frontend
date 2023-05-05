import React from 'react';

import {
  render,
  fireEvent,
  waitFor,
  screen,
  testAutocomplete,
  mockApi,
} from '../../../__test__/test-utils';
import { arrayOfDelegators } from '../../../redux/delegation/__test__/test.utils';
import {
  ACCEPT_DELEGATION,
  COUNT_DELEGATORS,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
} from '../../../api/delegations/delegations.routes';
import { apiClient } from '../../../api/apiClients';
import { DelegationStatus } from '../../../models/Deleghe';
import { AcceptButton, Menu, OrganizationsList } from '../DelegationsElements';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('DelegationElements', () => {
  it('renders the Menu closed', () => {
    const result = render(<Menu menuType="delegates" id="111" />);
    const menuIcon = result.queryByTestId('delegationMenuIcon');
    const closedMenu = result.queryByTestId('delegationMenu');

    expect(menuIcon).not.toBeNull();
    expect(closedMenu).toBeNull();
  });

  it('opens the delegate Menu', () => {
    const result = render(<Menu menuType="delegates" id="111" />);
    const menuIcon = result.getByTestId('delegationMenuIcon');
    const closedMenu = result.queryByTestId('delegationMenu');

    expect(closedMenu).toBeNull();

    fireEvent.click(menuIcon);
    const menu = result.getByTestId('delegationMenu');

    expect(menu).toHaveTextContent(/deleghe.revoke/i);
    expect(menu).toHaveTextContent(/deleghe.show/i);
  });

  it('opens the delegator Menu', () => {
    const result = render(<Menu menuType="delegators" id="111" />);
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

  it('renders the OrganizationList with multiple organizations and visibleItems set to 3', async () => {
    const result = render(
      <OrganizationsList
        organizations={['Bollate', 'Milano', 'Abbiategrasso', 'Malpensa']}
        visibleItems={3}
      />
    );
    const organizationsList = result.getByTestId('custom-tooltip-indicator');
    expect(result.container).toHaveTextContent(/deleghe.table.notificationsFrom/i);
    expect(result.container).toHaveTextContent(/BollateMilanoAbbiategrasso\+1/i);
    expect(result.container).not.toHaveTextContent(/Malpesa/i);
    await waitFor(() => fireEvent.mouseOver(organizationsList));
    await waitFor(() => expect(screen.getByText(/Malpensa/i)).toBeInTheDocument());
  });

  it('renders the AcceptButton - open the modal', async () => {
    const result = render(<AcceptButton id="1" name="test" />);
    expect(result.container).toHaveTextContent(/deleghe.accept/i);
    const button = result.queryByTestId('acceptButton') as Element;
    fireEvent.click(button);
    const codeDialog = await waitFor(() => screen.findByTestId('codeDialog'));
    expect(codeDialog).toBeInTheDocument();
  });

  it('renders the AcceptButton - close the modal', async () => {
    const result = render(<AcceptButton id="1" name="test" />);
    expect(result.container).toHaveTextContent(/deleghe.accept/i);
    const button = result.queryByTestId('acceptButton') as Element;
    fireEvent.click(button);
    const codeDialog = await waitFor(() => screen.findByTestId('codeDialog'));
    expect(codeDialog).toBeInTheDocument();
    const cancelButton = result.queryByTestId('codeCancelButton') as Element;
    fireEvent.click(cancelButton);
    await waitFor(() => expect(codeDialog).not.toBeInTheDocument());
  });

  it('renders the AcceptButton - accept the delegation', async () => {
    const groups = [
      { id: 'group-1', name: 'Group 1' },
      { id: 'group-2', name: 'Group 2' },
    ];
    const mock = mockApi(apiClient, 'PATCH', ACCEPT_DELEGATION('4'), 204, undefined, undefined);
    mockApi(mock, 'GET', COUNT_DELEGATORS(DelegationStatus.PENDING), 200, undefined, { value: 5 });
    const result = render(<AcceptButton id="4" name="test" />, {
      preloadedState: {
        delegationsState: {
          groups,
          delegations: {
            delegators: arrayOfDelegators,
          },
        },
      },
    });
    expect(result.container).toHaveTextContent(/deleghe.accept/i);
    const button = result.queryByTestId('acceptButton') as Element;
    fireEvent.click(button);
    const codeDialog = await waitFor(() => screen.findByTestId('codeDialog'));
    expect(codeDialog).toBeInTheDocument();
    const codeConfirmButton = codeDialog.querySelector(
      '[data-testid="codeConfirmButton"]'
    ) as Element;
    expect(codeConfirmButton).toBeDisabled();
    // fill the code
    const codeInputs = codeDialog.querySelectorAll('input');
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    expect(codeConfirmButton).toBeEnabled();
    // got to next step
    fireEvent.click(codeConfirmButton);
    const groupDialog = await waitFor(() => screen.findByTestId('groupDialog'));
    expect(groupDialog).toBeInTheDocument();
    // select groups to associate
    const associateGroupRadio = await waitFor(
      () => groupDialog.querySelector('[data-testid="associate-group"]') as Element
    );
    fireEvent.click(associateGroupRadio);
    await testAutocomplete(groupDialog, 'groups', groups, true, 1);
    const groupConfirmButton = groupDialog.querySelector(
      '[data-testid="groupConfirmButton"]'
    ) as Element;
    fireEvent.click(groupConfirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain('/mandate/api/v1/mandate/4/accept');
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        groups: ['group-2'],
        verificationCode: '01234',
      });
    });
    mock.reset();
    mock.restore();
  });

  it('check verificationCode for delegates', async () => {
    const verificationCode = '123456';
    const result = render(
      <Menu menuType="delegates" id="111" name="Mario Rossi" verificationCode={verificationCode} />
    );
    const menuIcon = result.getByTestId('delegationMenuIcon');

    fireEvent.click(menuIcon);
    const menu = result.getByTestId('delegationMenu');
    const show = menu.querySelectorAll('[role="menuitem"]')[0];
    fireEvent.click(show);
    const showDialog = await waitFor(() => screen.getByTestId('codeDialog'));
    const codeInputs = showDialog?.querySelectorAll('input');
    const arrayOfVerificationCode = verificationCode.split('');
    codeInputs?.forEach((input, index) => {
      expect(input).toHaveValue(arrayOfVerificationCode[index]);
    });
    const cancelButton = showDialog.querySelector('[data-testid="codeCancelButton"]');
    fireEvent.click(cancelButton!);
    await waitFor(() => {
      expect(showDialog).not.toBeInTheDocument();
    });
  });

  it('check revoke for delegatates', async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('111'), 200);

    const result = render(<Menu menuType="delegates" id="111" name="Mario Rossi" />);
    const menuIcon = result.getByTestId('delegationMenuIcon');

    fireEvent.click(menuIcon);
    const menu = result.getByTestId('delegationMenu');
    const revoke = menu.querySelectorAll('[role="menuitem"]')[1];
    fireEvent.click(revoke);
    const showDialog = await waitFor(() => screen.getByTestId('dialogStack'));
    const revokeButton = showDialog.querySelectorAll('[data-testid="dialogAction"]')[1];
    screen.debug(revokeButton);
    fireEvent.click(revokeButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain('mandate/api/v1/mandate/111/revoke');
      expect(showDialog).not.toBeInTheDocument();
    });
    mock.reset();
    mock.restore();
  });

  it('check close confimationDialog', async () => {
    const result = render(<Menu menuType="delegates" id="111" name="Mario Rossi" />);
    const menuIcon = result.getByTestId('delegationMenuIcon');

    fireEvent.click(menuIcon);
    const menu = result.getByTestId('delegationMenu');
    const revoke = menu.querySelectorAll('[role="menuitem"]')[1];
    fireEvent.click(revoke);
    const showDialog = await waitFor(() => screen.getByTestId('dialogStack'));
    const cancelButton = showDialog.querySelectorAll('[data-testid="dialogAction"]')[0];
    fireEvent.click(cancelButton!);
    await waitFor(() => {
      expect(showDialog).not.toBeInTheDocument();
    });
  });

  it('check reject for delegator', async () => {
    const mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('111'), 200);

    const result = render(<Menu menuType="delegators" id="111" name="Mario Rossi" />);
    const menuIcon = result.getByTestId('delegationMenuIcon');

    fireEvent.click(menuIcon);
    const menu = result.getByTestId('delegationMenu');
    const reject = menu.querySelectorAll('[role="menuitem"]')[0];
    fireEvent.click(reject);
    const showDialog = await waitFor(() => screen.getByTestId('dialogStack'));
    const rejectButton = showDialog.querySelectorAll('[data-testid="dialogAction"]')[1];
    fireEvent.click(rejectButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain('mandate/api/v1/mandate/111/reject');
      expect(showDialog).not.toBeInTheDocument();
    });
    mock.reset();
    mock.restore();
  });
});
