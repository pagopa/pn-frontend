import React from 'react';

import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';

import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
import {
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { DELEGATION_ACTIONS } from '../../../redux/delegation/actions';
import { Delegator } from '../../../redux/delegation/types';
import { sortDelegations } from '../../../utility/delegation.utility';
import Delegators from '../Delegators';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Delegators Component', () => {
  it('renders the empty state', () => {
    const { container, queryByTestId, getByTestId } = render(<Delegators />);
    expect(container).toHaveTextContent(/deleghe.delegatorsTitle/i);
    const delegatorsTable = queryByTestId('delegatorsTable');
    expect(delegatorsTable).not.toBeInTheDocument();
    expect(container).toHaveTextContent(/deleghe.no_delegators/i);
  });

  it('renders the delegators', () => {
    const { getByTestId, getAllByTestId } = render(<Delegators />, {
      preloadedState: { delegationsState: { delegations: { delegators: arrayOfDelegators } } },
    });
    const delegatorsTable = getByTestId('delegatorsTable');
    expect(delegatorsTable).toBeInTheDocument();
    const delegatorsRows = getAllByTestId('delegatorsTable.row');
    expect(delegatorsRows).toHaveLength(arrayOfDelegators.length);
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(arrayOfDelegators[index].delegator?.displayName!);
    });
  });

  it('sorts the delegators', async () => {
    const { getByTestId, getAllByTestId } = render(<Delegators />, {
      preloadedState: {
        delegationsState: {
          delegations: { delegators: arrayOfDelegators },
          sortDelegators: {
            orderBy: '',
            order: 'asc',
          },
        },
      },
    });
    let delegatorsTable = getByTestId('delegatorsTable');
    expect(delegatorsTable).toBeInTheDocument();
    // sort by name asc
    let sortName = within(delegatorsTable).getByTestId('delegatorsTable.sort.name');
    let sortIcon = within(sortName).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testStore.getState().delegationsState.sortDelegators).toStrictEqual({
        order: 'asc',
        orderBy: 'name',
      });
    });
    let delegatorsRows = getAllByTestId('delegatorsTable.row');
    let sortedDelegators = sortDelegations('asc', 'name', arrayOfDelegators) as Array<Delegator>;
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegators[index].delegator?.displayName!);
    });
    // sort by name desc
    delegatorsTable = getByTestId('delegatorsTable');
    sortName = within(delegatorsTable).getByTestId('delegatorsTable.sort.name');
    sortIcon = within(sortName).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testStore.getState().delegationsState.sortDelegators).toStrictEqual({
        order: 'desc',
        orderBy: 'name',
      });
    });
    delegatorsRows = getAllByTestId('delegatorsTable.row');
    sortedDelegators = sortDelegations('desc', 'name', arrayOfDelegators) as Array<Delegator>;
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegators[index].delegator?.displayName!);
    });
    // sort by endDate asc
    delegatorsTable = getByTestId('delegatorsTable');
    const sortEndDate = within(delegatorsTable).getByTestId('delegatorsTable.sort.endDate');
    sortIcon = within(sortEndDate).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testStore.getState().delegationsState.sortDelegators).toStrictEqual({
        order: 'asc',
        orderBy: 'endDate',
      });
    });
    delegatorsRows = getAllByTestId('delegatorsTable.row');
    sortedDelegators = sortDelegations('asc', 'endDate', arrayOfDelegators) as Array<Delegator>;
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegators[index].delegator?.displayName!);
    });
  });

  it('API error', async () => {
    render(<Delegators />, {
      preloadedState: {
        appState: apiOutcomeTestHelper.appStateWithMessageForAction(
          DELEGATION_ACTIONS.GET_DELEGATORS
        ),
      },
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${DELEGATION_ACTIONS.GET_DELEGATORS}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});
