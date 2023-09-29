import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { testAutocomplete } from '@pagopa-pn/pn-commons/src/test-utils';

import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  ACCEPT_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  REJECT_DELEGATION,
  UPDATE_DELEGATION,
} from '../../../api/delegations/delegations.routes';
import { DelegationStatus } from '../../../models/Deleghe';
import { DELEGATION_ACTIONS } from '../../../redux/delegation/actions';
import DelegationsOfTheCompany from '../DelegationsOfTheCompany';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

export async function testMultiSelect(
  form: HTMLElement,
  elementName: string,
  options: Array<{ id: string; name: string }>,
  optToSelect: number,
  mustBeOpened: boolean
) {
  if (mustBeOpened) {
    const selectButton = form.querySelector(`div[id="${elementName}"]`);
    fireEvent.mouseDown(selectButton!);
  }
  const selectOptionsContainer = await screen.findByRole('presentation');
  expect(selectOptionsContainer).toBeInTheDocument();
  const selectOptionsList = await within(selectOptionsContainer).findByRole('listbox');
  expect(selectOptionsList).toBeInTheDocument();
  const selectOptionsListItems = await within(selectOptionsList).findAllByRole('option');
  expect(selectOptionsListItems).toHaveLength(options.length);
  selectOptionsListItems.forEach((opt, index) => {
    expect(opt).toHaveTextContent(options[index].name);
  });
  fireEvent.click(selectOptionsListItems[optToSelect]);
}

const initialState = {
  delegations: {
    delegators: [],
    delegates: [],
  },
  pagination: {
    nextPagesKey: [],
    moreResult: false,
  },
  groups: [],
  filters: {
    size: 10,
    page: 0,
  },
};

describe('DelegationsOfTheCompany Component', () => {
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

  it('renders the empty state', () => {
    const { container } = render(<DelegationsOfTheCompany />);
    expect(container).toHaveTextContent(/deleghe.delegatorsTitle/i);
    expect(container).toHaveTextContent(/deleghe.no_delegators/i);
    expect(container).not.toHaveTextContent(/deleghe.table.name/i);
    expect(container).not.toHaveTextContent(/deleghe.table.delegationStart/i);
    expect(container).not.toHaveTextContent(/deleghe.table.delegationEnd/i);
    expect(container).not.toHaveTextContent(/deleghe.table.permissions/i);
    expect(container).not.toHaveTextContent(/deleghe.table.groups/i);
    expect(container).not.toHaveTextContent(/deleghe.table.status/i);
  });

  it('renders the table', () => {
    const { container, getByTestId, getAllByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: arrayOfDelegators,
          },
        },
      },
    });

    expect(container).not.toHaveTextContent(/deleghe.no_delegators/i);
    expect(container).toHaveTextContent(/deleghe.table.name/i);
    expect(container).toHaveTextContent(/deleghe.table.delegationStart/i);
    expect(container).toHaveTextContent(/deleghe.table.delegationEnd/i);
    expect(container).toHaveTextContent(/deleghe.table.permissions/i);
    expect(container).toHaveTextContent(/deleghe.table.groups/i);
    expect(container).toHaveTextContent(/deleghe.table.status/i);
    const table = getByTestId('table(notifications)');
    expect(table).toBeInTheDocument();
    const rows = getAllByTestId('table(notifications).row');
    expect(rows).toHaveLength(arrayOfDelegators.length);
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(arrayOfDelegators[index].delegator?.displayName!);
    });
  });

  it('filters the results', async () => {
    mock
      .onPost(DELEGATIONS_BY_DELEGATE({ size: 10, nextPageKey: undefined }), {
        groups: ['group-2'],
        status: [DelegationStatus.ACTIVE, DelegationStatus.REJECTED],
      })
      .reply(200, {
        resultsPage: [arrayOfDelegators[1]],
        moreResult: false,
        nextPagesKey: [],
      });
    const groups = [
      {
        id: 'group-1',
        name: 'Group 1',
        status: 'ACTIVE',
      },
      {
        id: 'group-2',
        name: 'Group 2',
        status: 'ACTIVE',
      },
    ];
    const status = [
      { id: DelegationStatus.ACTIVE, name: 'deleghe.table.active' },
      { id: DelegationStatus.PENDING, name: 'deleghe.table.pending' },
      { id: DelegationStatus.REJECTED, name: 'deleghe.table.rejected' },
    ];
    const { container, getAllByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: arrayOfDelegators,
          },
          groups,
        },
      },
    });

    const form = container.querySelector('form');
    const cancelButton = within(form!).getByTestId('cancelButton');
    const confirmButton = within(form!).getByTestId('confirmButton');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
    await testAutocomplete(form!, 'groups', groups, true, 1, false);
    await testMultiSelect(form!, 'status', status, 0, true);
    await testMultiSelect(form!, 'status', status, 2, false);
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain('mandate/api/v1/mandates-by-delegate?size=10');
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        groups: ['group-2'],
        status: [DelegationStatus.ACTIVE, DelegationStatus.REJECTED],
      });
    });
    const rows = getAllByTestId('table(notifications).row');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(arrayOfDelegators[1].delegator?.displayName!);
    expect(cancelButton).toBeEnabled();
  });

  it('change pagination size', async () => {
    mock.onPost(DELEGATIONS_BY_DELEGATE({ size: 20 })).reply(200, {
      resultsPage: [arrayOfDelegators[1]],
      moreResult: false,
      nextPagesKey: [],
    });
    const { getAllByTestId, getByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: [arrayOfDelegators[0]],
          },
        },
      },
    });

    let rows = getAllByTestId('table(notifications).row');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(arrayOfDelegators[0].delegator?.displayName!);
    const itemsPerPageSelector = getByTestId('itemsPerPageSelector');
    const button = itemsPerPageSelector.querySelector('button');
    expect(button).toHaveTextContent(/10/i);
    fireEvent.click(button!);
    const itemsPerPageListContainer = await waitFor(() => screen.queryByRole('presentation'));
    expect(itemsPerPageListContainer).toBeInTheDocument();
    const itemsPerPageList = screen.getAllByRole('menuitem');
    expect(itemsPerPageList).toHaveLength(3);
    fireEvent.click(itemsPerPageList[1]!);
    await waitFor(() => {
      expect(button).toHaveTextContent(/20/i);
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain('mandate/api/v1/mandates-by-delegate?size=20');
    });
    rows = getAllByTestId('table(notifications).row');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(arrayOfDelegators[1].delegator?.displayName!);
  });

  it('change pagination page', async () => {
    mock.onPost(DELEGATIONS_BY_DELEGATE({ size: 10, nextPageKey: 'page-1' })).reply(200, {
      resultsPage: [arrayOfDelegators[1]],
      moreResult: false,
      nextPagesKey: [],
    });
    const { getAllByTestId, getByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: [arrayOfDelegators[0]],
          },
          pagination: {
            nextPagesKey: ['page-1', 'page-2', 'page-3'],
            moreResult: false,
          },
        },
      },
    });
    let rows = getAllByTestId('table(notifications).row');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(arrayOfDelegators[0].delegator?.displayName!);
    const pageSelector = getByTestId('pageSelector');
    const pageButtons = pageSelector.querySelectorAll('button');
    // depends on mui pagination
    // for 10 pages we have: < 1 2 3 >
    expect(pageButtons).toHaveLength(5);
    expect(pageButtons[1]).toHaveTextContent(/1/i);
    expect(pageButtons[2]).toHaveTextContent(/2/i);
    expect(pageButtons[3]).toHaveTextContent(/3/i);
    fireEvent.click(pageButtons[2]);
    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain(
        'mandate/api/v1/mandates-by-delegate?size=10&nextPageKey=page-1'
      );
    });
    rows = getAllByTestId('table(notifications).row');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(arrayOfDelegators[1].delegator?.displayName!);
  });

  it('test reject delegation', async () => {
    mock.onPatch(REJECT_DELEGATION(arrayOfDelegators[0].mandateId)).reply(204);
    const { getAllByTestId, getByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: arrayOfDelegators,
            delegates: [],
          },
        },
      },
    });
    const menu = getAllByTestId('delegationMenuIcon');
    fireEvent.click(menu[0]);
    const menuOpen = await waitFor(async () => getByTestId('delegationMenu'));
    const menuItems = menuOpen.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(1);
    expect(menuItems[0]).toHaveTextContent(/deleghe.reject/i);
    fireEvent.click(menuItems[0]);
    const dialog = await waitFor(() => getByTestId('confirmationDialog'));
    expect(dialog).toBeInTheDocument();
    const dialogAction = within(dialog).getAllByTestId('dialogAction');
    // click on confirm button
    fireEvent.click(dialogAction[1]);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain(
        `mandate/api/v1/mandate/${arrayOfDelegators[0].mandateId}/reject`
      );
      expect(dialog).not.toBeInTheDocument();
    });
    const rows = getAllByTestId('table(notifications).row');
    expect(rows).toHaveLength(arrayOfDelegators.length - 1);
    // the index + 1 is because we reject the first delegator
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(arrayOfDelegators[index + 1].delegator?.displayName!);
    });
  });

  it('test accept delegation', async () => {
    mock.onPatch(ACCEPT_DELEGATION(arrayOfDelegators[0].mandateId)).reply(204);
    const { getByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: arrayOfDelegators,
            delegates: [],
          },
        },
      },
    });
    const table = getByTestId('table(notifications)');
    expect(table).toBeInTheDocument();
    const acceptButton = within(table).getByTestId('acceptButton');
    expect(acceptButton).toBeInTheDocument();
    fireEvent.click(acceptButton);
    const dialog = await waitFor(() => getByTestId('codeDialog'));
    expect(dialog).toBeInTheDocument();
    // fill the code
    const codeInputs = dialog.querySelectorAll('input');
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    const codeConfirmButton = within(dialog).getByTestId('codeConfirmButton');
    // click on confirm button
    fireEvent.click(codeConfirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain(
        `mandate/api/v1/mandate/${arrayOfDelegators[0].mandateId}/accept`
      );
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        groups: [],
        verificationCode: '01234',
      });
      expect(dialog).not.toBeInTheDocument();
    });
    expect(acceptButton).not.toBeInTheDocument();
  });

  it('test update delegation', async () => {
    const groups = [
      { id: 'group-1', name: 'Group 1', status: 'ACTIVE' },
      { id: 'group-2', name: 'Group 2', status: 'ACTIVE' },
      { id: 'group-3', name: 'Group 3', status: 'ACTIVE' },
    ];
    mock.onPatch(UPDATE_DELEGATION(arrayOfDelegators[1].mandateId)).reply(204);
    const { getByTestId, getAllByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: arrayOfDelegators,
            delegates: [],
          },
          groups,
        },
      },
    });
    let rows = getAllByTestId('table(notifications).row');
    expect(rows[1]).not.toHaveTextContent('Group 3');
    const menu = within(rows[1]).getByTestId('delegationMenuIcon');
    fireEvent.click(menu);
    const menuOpen = await waitFor(async () => getByTestId('delegationMenu'));
    const menuItems = menuOpen.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[1]).toHaveTextContent(/deleghe.update/i);
    fireEvent.click(menuItems[1]);
    const updateDialog = await waitFor(() => screen.getByTestId('groupDialog'));
    expect(updateDialog).toBeInTheDocument();
    const associateGroupRadio = within(updateDialog).getByTestId('associate-group');
    fireEvent.click(associateGroupRadio);
    await testAutocomplete(updateDialog, 'groups', groups, true, 2);
    const groupConfirmButton = within(updateDialog).getByTestId('groupConfirmButton');
    fireEvent.click(groupConfirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain(
        `/mandate/api/v1/mandate/${arrayOfDelegators[1].mandateId}/update`
      );
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        groups: ['group-3'],
      });
    });
    rows = getAllByTestId('table(notifications).row');
    expect(rows[1]).toHaveTextContent('Group 3');
  });
});
