import { vi } from 'vitest';

import { mandatesByDelegator } from '../../../__mocks__/Delegations.mock';
import { fireEvent, render, testStore, waitFor, within } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import { Delegate } from '../../../redux/delegation/types';
import { sortDelegations } from '../../../utility/delegation.utility';
import Delegates from '../Delegates';

const mockNavigateFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('Delegates Component', async () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the empty state', () => {
    const { container, queryByTestId, getByTestId } = render(<Delegates />);
    expect(container).toHaveTextContent(/deleghe.delegatesTitle/i);
    const addDelegation = getByTestId('add-delegation');
    expect(addDelegation).toBeInTheDocument();
    const delegatesTable = queryByTestId('delegatesTable');
    expect(delegatesTable).not.toBeInTheDocument();
    expect(container).toHaveTextContent(/deleghe.add/i);
    expect(container).toHaveTextContent(/deleghe.no_delegates/i);
    // clicks on empty state action
    const button = getByTestId('link-add-delegate');
    fireEvent.click(button);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NUOVA_DELEGA);
  });

  it('navigates to the add delegation page', () => {
    const { getByTestId } = render(<Delegates />);
    const addDelegation = getByTestId('add-delegation');
    fireEvent.click(addDelegation);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NUOVA_DELEGA);
  });

  it('renders the delegates', () => {
    const { getByTestId, getAllByTestId } = render(<Delegates />, {
      preloadedState: { delegationsState: { delegations: { delegates: mandatesByDelegator } } },
    });
    const delegatesTable = getByTestId('delegatesTable');
    expect(delegatesTable).toBeInTheDocument();
    const delegatesRows = getAllByTestId('delegatesTable.body.row');
    expect(delegatesRows).toHaveLength(mandatesByDelegator.length);
    delegatesRows.forEach((row, index) => {
      expect(row).toHaveTextContent(mandatesByDelegator[index].delegate?.displayName!);
    });
  });

  it('sorts the delegates', async () => {
    const { getByTestId, getAllByTestId } = render(<Delegates />, {
      preloadedState: {
        delegationsState: {
          delegations: { delegates: mandatesByDelegator },
          sortDelegates: {
            orderBy: '',
            order: 'asc',
          },
        },
      },
    });
    let delegatesTable = getByTestId('delegatesTable');
    expect(delegatesTable).toBeInTheDocument();
    // sort by name asc
    let sortName = within(delegatesTable).getByTestId('delegatesTable.header.cell.sort.name');
    let sortIcon = within(sortName).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testStore.getState().delegationsState.sortDelegates).toStrictEqual({
        order: 'asc',
        orderBy: 'name',
      });
    });
    let delegatesRows = getAllByTestId('delegatesTable.body.row');
    let sortedDelegates = sortDelegations('asc', 'name', mandatesByDelegator) as Array<Delegate>;
    delegatesRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegates[index].delegate?.displayName!);
    });
    // sort by name desc
    delegatesTable = getByTestId('delegatesTable');
    sortName = within(delegatesTable).getByTestId('delegatesTable.header.cell.sort.name');
    sortIcon = within(sortName).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testStore.getState().delegationsState.sortDelegates).toStrictEqual({
        order: 'desc',
        orderBy: 'name',
      });
    });
    delegatesRows = getAllByTestId('delegatesTable.body.row');
    sortedDelegates = sortDelegations('desc', 'name', mandatesByDelegator) as Array<Delegate>;
    delegatesRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegates[index].delegate?.displayName!);
    });
    // sort by endDate asc
    delegatesTable = getByTestId('delegatesTable');
    const sortEndDate = within(delegatesTable).getByTestId(
      'delegatesTable.header.cell.sort.endDate'
    );
    sortIcon = within(sortEndDate).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testStore.getState().delegationsState.sortDelegates).toStrictEqual({
        order: 'asc',
        orderBy: 'endDate',
      });
    });
    delegatesRows = getAllByTestId('delegatesTable.body.row');
    sortedDelegates = sortDelegations('asc', 'endDate', mandatesByDelegator) as Array<Delegate>;
    delegatesRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegates[index].delegate?.displayName!);
    });
  });

  it('shows verification code', async () => {
    const { getByTestId, getAllByTestId } = render(<Delegates />, {
      preloadedState: {
        delegationsState: {
          delegations: { delegates: mandatesByDelegator },
        },
      },
    });
    // get first row
    const delegatesRows = getAllByTestId('delegatesTable.body.row');
    const delegationMenuIcon = within(delegatesRows[0]).getByTestId('delegationMenuIcon');
    // open menu
    fireEvent.click(delegationMenuIcon);
    const showCode = await waitFor(() => getByTestId('menuItem-showCode'));
    // show code dialog
    fireEvent.click(showCode);
    const dialog = await waitFor(() => getByTestId('codeDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('deleghe.show_code_title');
    expect(dialog).toHaveTextContent('deleghe.show_code_subtitle');
    expect(dialog).toHaveTextContent('deleghe.close');
    expect(dialog).toHaveTextContent('deleghe.verification_code');
    const textbox = within(dialog).getByRole('textbox');
    expect(textbox).toHaveValue(mandatesByDelegator[0].verificationCode);

    const copyBtn = within(dialog).getByTestId('copyCodeButton');
    expect(copyBtn).toBeInTheDocument();
  });
});
