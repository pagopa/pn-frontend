import { vi } from 'vitest';

import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { Delegator } from '../../../redux/delegation/types';
import { sortDelegations } from '../../../utility/delegation.utility';
import Delegators from '../Delegators';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('Delegators Component', async () => {
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const testUtils = await import('../../../__test__/test-utils');

  it('renders the empty state', () => {
    const { container, queryByTestId } = render(<Delegators />);
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
    const delegatorsRows = getAllByTestId('delegatorsTable.body.row');
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
    let sortName = within(delegatorsTable).getByTestId('delegatorsTable.header.cell.sort.name');
    let sortIcon = within(sortName).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testUtils.testStore.getState().delegationsState.sortDelegators).toStrictEqual({
        order: 'asc',
        orderBy: 'name',
      });
    });
    let delegatorsRows = getAllByTestId('delegatorsTable.body.row');
    let sortedDelegators = sortDelegations('asc', 'name', arrayOfDelegators) as Array<Delegator>;
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegators[index].delegator?.displayName!);
    });
    // sort by name desc
    delegatorsTable = getByTestId('delegatorsTable');
    sortName = within(delegatorsTable).getByTestId('delegatorsTable.header.cell.sort.name');
    sortIcon = within(sortName).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testUtils.testStore.getState().delegationsState.sortDelegators).toStrictEqual({
        order: 'desc',
        orderBy: 'name',
      });
    });
    delegatorsRows = getAllByTestId('delegatorsTable.body.row');
    sortedDelegators = sortDelegations('desc', 'name', arrayOfDelegators) as Array<Delegator>;
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegators[index].delegator?.displayName!);
    });
    // sort by endDate asc
    delegatorsTable = getByTestId('delegatorsTable');
    const sortEndDate = within(delegatorsTable).getByTestId(
      'delegatorsTable.header.cell.sort.endDate'
    );
    sortIcon = within(sortEndDate).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testUtils.testStore.getState().delegationsState.sortDelegators).toStrictEqual({
        order: 'asc',
        orderBy: 'endDate',
      });
    });
    delegatorsRows = getAllByTestId('delegatorsTable.body.row');
    sortedDelegators = sortDelegations('asc', 'endDate', arrayOfDelegators) as Array<Delegator>;
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegators[index].delegator?.displayName!);
    });
  });
});
