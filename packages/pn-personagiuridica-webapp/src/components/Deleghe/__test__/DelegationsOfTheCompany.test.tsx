import MockAdapter from 'axios-mock-adapter';

import { testAutocomplete } from '@pagopa-pn/pn-commons/src/test-utils';
import userEvent from '@testing-library/user-event';

import { mandatesByDelegate } from '../../../__mocks__/Delegations.mock';
import { render, screen, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { DelegationStatus } from '../../../models/Deleghe';
import DelegationsOfTheCompany from '../DelegationsOfTheCompany';

export async function testMultiSelect(
  form: HTMLElement,
  elementName: string,
  options: Array<{ id: string; name: string }>,
  optToSelect: number,
  mustBeOpened: boolean
) {
  if (mustBeOpened) {
    const selectButton = form.querySelector(`div[id="${elementName}"]`);
    await userEvent.click(selectButton!);
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
  await userEvent.click(selectOptionsListItems[optToSelect]);
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

describe('DelegationsOfTheCompany Component', async () => {
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
            delegators: mandatesByDelegate,
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
    const table = getByTestId('delegationsDesktop');
    expect(table).toBeInTheDocument();
    const rows = getAllByTestId('delegationsBodyRowDesktop');
    expect(rows).toHaveLength(mandatesByDelegate.length);
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(mandatesByDelegate[index].delegator?.displayName!);
    });
  });

  it('filters the results', async () => {
    mock
      .onPost('/bff/v1/mandate/delegate?size=10', {
        groups: ['group-2'],
        status: [DelegationStatus.ACTIVE, DelegationStatus.REJECTED],
      })
      .reply(200, {
        resultsPage: [mandatesByDelegate[1]],
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
            delegators: mandatesByDelegate,
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
    await userEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain('/bff/v1/mandate/delegate?size=10');
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        groups: ['group-2'],
        status: [DelegationStatus.ACTIVE, DelegationStatus.REJECTED],
      });
    });
    const rows = getAllByTestId('delegationsBodyRowDesktop');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(mandatesByDelegate[1].delegator?.displayName!);
    expect(cancelButton).toBeEnabled();
  });

  it('filters the results and show empty state', async () => {
    mock
      .onPost('/bff/v1/mandate/delegate?size=10', {
        groups: ['group-2'],
        status: [DelegationStatus.ACTIVE, DelegationStatus.REJECTED],
      })
      .reply(200, {
        resultsPage: [],
        moreResult: false,
        nextPagesKey: [],
      });
    mock.onPost('/bff/v1/mandate/delegate?size=10').reply(200, {
      resultsPage: mandatesByDelegate,
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
    const { container, queryByTestId, getByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: mandatesByDelegate,
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
    await userEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain('/bff/v1/mandate/delegate?size=10');
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        groups: ['group-2'],
        status: [DelegationStatus.ACTIVE, DelegationStatus.REJECTED],
      });
    });
    let table = queryByTestId('delegationsDesktop');
    expect(table).not.toBeInTheDocument();
    expect(container).toHaveTextContent(/deleghe.no_delegators_after_filters/i);
    // clicks on empty state action
    const button = getByTestId('link-remove-filters');
    await userEvent.click(button);
    await waitFor(() => {
      expect(mock.history.post.length).toBe(2);
      expect(mock.history.post[0].url).toContain('/bff/v1/mandate/delegate?size=10');
    });
    expect(container).not.toHaveTextContent(/deleghe.no_delegators_after_filters/i);
    table = getByTestId('delegationsDesktop');
    expect(table).toBeInTheDocument();
  });

  it('change pagination size', async () => {
    mock.onPost('/bff/v1/mandate/delegate?size=20').reply(200, {
      resultsPage: [mandatesByDelegate[1]],
      moreResult: false,
      nextPagesKey: [],
    });
    const { getAllByTestId, getByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: [mandatesByDelegate[0]],
          },
        },
      },
    });

    let rows = getAllByTestId('delegationsBodyRowDesktop');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(mandatesByDelegate[0].delegator?.displayName!);
    const itemsPerPageSelector = getByTestId('itemsPerPageSelector');
    const button = itemsPerPageSelector.querySelector('button');
    expect(button).toHaveTextContent(/10/i);
    await userEvent.click(button!);
    const itemsPerPageListContainer = await waitFor(() => screen.queryByRole('presentation'));
    expect(itemsPerPageListContainer).toBeInTheDocument();
    const itemsPerPageList = screen.getAllByRole('menuitem');
    expect(itemsPerPageList).toHaveLength(3);
    await userEvent.click(itemsPerPageList[1]!);
    await waitFor(() => {
      expect(button).toHaveTextContent(/20/i);
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain('/bff/v1/mandate/delegate?size=20');
    });
    rows = getAllByTestId('delegationsBodyRowDesktop');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(mandatesByDelegate[1].delegator?.displayName!);
  });

  it('change pagination page', async () => {
    mock.onPost('/bff/v1/mandate/delegate?size=10&nextPageKey=page-1').reply(200, {
      resultsPage: [mandatesByDelegate[1]],
      moreResult: false,
      nextPagesKey: [],
    });
    const { getAllByTestId, getByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: [mandatesByDelegate[0]],
          },
          pagination: {
            nextPagesKey: ['page-1', 'page-2', 'page-3'],
            moreResult: false,
          },
        },
      },
    });
    let rows = getAllByTestId('delegationsBodyRowDesktop');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(mandatesByDelegate[0].delegator?.displayName!);
    const pageSelector = getByTestId('pageSelector');
    const pageButtons = pageSelector.querySelectorAll('button');
    // depends on mui pagination
    // for 10 pages we have: < 1 2 3 >
    expect(pageButtons).toHaveLength(5);
    expect(pageButtons[1]).toHaveTextContent(/1/i);
    expect(pageButtons[2]).toHaveTextContent(/2/i);
    expect(pageButtons[3]).toHaveTextContent(/3/i);
    await userEvent.click(pageButtons[2]);
    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain(
        '/bff/v1/mandate/delegate?size=10&nextPageKey=page-1'
      );
    });
    rows = getAllByTestId('delegationsBodyRowDesktop');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(mandatesByDelegate[1].delegator?.displayName!);
  });

  it('test reject delegation', async () => {
    mock.onPatch(`/bff/v1/mandate/${mandatesByDelegate[0].mandateId}/reject`).reply(204);
    const { getAllByTestId, getByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: mandatesByDelegate,
            delegates: [],
          },
        },
      },
    });
    const menu = getAllByTestId('delegationMenuIcon');
    await userEvent.click(menu[0]);
    const menuOpen = await waitFor(async () => getByTestId('delegationMenu'));
    const menuItems = menuOpen.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(1);
    expect(menuItems[0]).toHaveTextContent(/deleghe.reject/i);
    await userEvent.click(menuItems[0]);
    const dialog = await waitFor(() => getByTestId('confirmationDialog'));
    expect(dialog).toBeInTheDocument();
    const confirmButton = within(dialog).getByTestId('confirmButton');
    // click on confirm button
    await userEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain(
        `/bff/v1/mandate/${mandatesByDelegate[0].mandateId}/reject`
      );
      expect(dialog).not.toBeInTheDocument();
    });
    const rows = getAllByTestId('delegationsBodyRowDesktop');
    expect(rows).toHaveLength(mandatesByDelegate.length - 1);
    // the index + 1 is because we reject the first delegator
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(mandatesByDelegate[index + 1].delegator?.displayName!);
    });
  });

  it('test accept delegation', async () => {
    mock.onPatch(`/bff/v1/mandate/${mandatesByDelegate[0].mandateId}/accept`).reply(204);
    const { getByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: mandatesByDelegate,
            delegates: [],
          },
        },
      },
    });
    const table = getByTestId('delegationsDesktop');
    expect(table).toBeInTheDocument();
    const acceptButton = within(table).getByTestId('acceptButton');
    expect(acceptButton).toBeInTheDocument();
    await userEvent.click(acceptButton);
    const dialog = await waitFor(() => getByTestId('codeDialog'));
    expect(dialog).toBeInTheDocument();
    // fill the code
    const textbox = within(dialog).getByRole('textbox');
    textbox.focus();
    await userEvent.keyboard('01234');
    const codeConfirmButton = within(dialog).getByTestId('codeConfirmButton');
    // click on confirm button
    await userEvent.click(codeConfirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain(
        `/bff/v1/mandate/${mandatesByDelegate[0].mandateId}/accept`
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
    mock.onPatch(`/bff/v1/mandate/${mandatesByDelegate[1].mandateId}/update`).reply(204);
    const { getByTestId, getAllByTestId } = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState,
          delegations: {
            delegators: mandatesByDelegate,
            delegates: [],
          },
          groups,
        },
      },
    });
    let rows = getAllByTestId('delegationsBodyRowDesktop');
    expect(rows[1]).not.toHaveTextContent('Group 3');
    const menu = within(rows[1]).getByTestId('delegationMenuIcon');
    await userEvent.click(menu);
    const menuOpen = await waitFor(async () => getByTestId('delegationMenu'));
    const menuItems = menuOpen.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[1]).toHaveTextContent(/deleghe.update/i);
    await userEvent.click(menuItems[1]);
    const updateDialog = await waitFor(() => screen.getByTestId('groupDialog'));
    expect(updateDialog).toBeInTheDocument();
    const associateGroupRadio = within(updateDialog).getByTestId('associate-group');
    await userEvent.click(associateGroupRadio);
    await testAutocomplete(updateDialog, 'modal-groups', groups, true, 2);
    const groupConfirmButton = within(updateDialog).getByTestId('groupConfirmButton');
    await userEvent.click(groupConfirmButton);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain(
        `/bff/v1/mandate/${mandatesByDelegate[1].mandateId}/update`
      );
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        groups: ['group-3'],
      });
    });
    rows = getAllByTestId('delegationsBodyRowDesktop');
    expect(rows[1]).toHaveTextContent('Group 3');
  });
});
