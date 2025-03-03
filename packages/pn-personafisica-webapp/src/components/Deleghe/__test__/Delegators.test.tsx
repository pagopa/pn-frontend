import { mandatesByDelegate } from '../../../__mocks__/Delegations.mock';
import { fireEvent, render, testStore, waitFor, within } from '../../../__test__/test-utils';
import { Delegator } from '../../../redux/delegation/types';
import { sortDelegations } from '../../../utility/delegation.utility';
import Delegators from '../Delegators';

describe('Delegators Component', async () => {
  it('renders the empty state', () => {
    const { container, queryByTestId } = render(<Delegators />);
    expect(container).toHaveTextContent(/deleghe.delegatorsTitle/i);
    const delegatorsTable = queryByTestId('delegatorsTable');
    expect(delegatorsTable).not.toBeInTheDocument();
    expect(container).toHaveTextContent(/deleghe.no_delegators/i);
  });

  it('renders the delegators', () => {
    const { getByTestId, getAllByTestId } = render(<Delegators />, {
      preloadedState: { delegationsState: { delegations: { delegators: mandatesByDelegate } } },
    });
    const delegatorsTable = getByTestId('delegatorsTable');
    expect(delegatorsTable).toBeInTheDocument();
    const delegatorsRows = getAllByTestId('delegatorsTable.body.row');
    expect(delegatorsRows).toHaveLength(mandatesByDelegate.length);
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(mandatesByDelegate[index].delegator?.displayName!);
    });
  });

  it('sorts the delegators', async () => {
    const { getByTestId, getAllByTestId } = render(<Delegators />, {
      preloadedState: {
        delegationsState: {
          delegations: { delegators: mandatesByDelegate },
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
      expect(testStore.getState().delegationsState.sortDelegators).toStrictEqual({
        order: 'asc',
        orderBy: 'name',
      });
    });
    let delegatorsRows = getAllByTestId('delegatorsTable.body.row');
    let sortedDelegators = sortDelegations('asc', 'name', mandatesByDelegate) as Array<Delegator>;
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegators[index].delegator?.displayName!);
    });
    // sort by name desc
    delegatorsTable = getByTestId('delegatorsTable');
    sortName = within(delegatorsTable).getByTestId('delegatorsTable.header.cell.sort.name');
    sortIcon = within(sortName).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testStore.getState().delegationsState.sortDelegators).toStrictEqual({
        order: 'desc',
        orderBy: 'name',
      });
    });
    delegatorsRows = getAllByTestId('delegatorsTable.body.row');
    sortedDelegators = sortDelegations('desc', 'name', mandatesByDelegate) as Array<Delegator>;
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
      expect(testStore.getState().delegationsState.sortDelegators).toStrictEqual({
        order: 'asc',
        orderBy: 'endDate',
      });
    });
    delegatorsRows = getAllByTestId('delegatorsTable.body.row');
    sortedDelegators = sortDelegations('asc', 'endDate', mandatesByDelegate) as Array<Delegator>;
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegators[index].delegator?.displayName!);
    });
  });
});
