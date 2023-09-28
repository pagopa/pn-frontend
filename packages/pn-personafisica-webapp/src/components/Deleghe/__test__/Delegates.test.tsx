import React from 'react';

import { arrayOfDelegates } from '../../../__mocks__/Delegations.mock';
import {
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import { Delegate } from '../../../redux/delegation/types';
import { sortDelegations } from '../../../utility/delegation.utility';
import Delegates from '../Delegates';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Delegates Component', () => {
  it('renders the empty state', () => {
    const { container, queryByTestId, getByTestId } = render(<Delegates />);
    expect(container).toHaveTextContent(/deleghe.delegatesTitle/i);
    const addDelegation = getByTestId('add-delegation');
    expect(addDelegation).toBeInTheDocument();
    const delegatesTable = queryByTestId('delegatesTable');
    expect(delegatesTable).not.toBeInTheDocument();
    expect(container).toHaveTextContent(/deleghe.add/i);
    expect(container).toHaveTextContent(/deleghe.no_delegates/i);
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
      preloadedState: { delegationsState: { delegations: { delegates: arrayOfDelegates } } },
    });
    const delegatesTable = getByTestId('delegatesTable');
    expect(delegatesTable).toBeInTheDocument();
    const delegatesRows = getAllByTestId('delegatesTable.row');
    expect(delegatesRows).toHaveLength(arrayOfDelegates.length);
    delegatesRows.forEach((row, index) => {
      expect(row).toHaveTextContent(arrayOfDelegates[index].delegate?.displayName!);
    });
  });

  it('sorts the delegates', async () => {
    const { getByTestId, getAllByTestId } = render(<Delegates />, {
      preloadedState: {
        delegationsState: {
          delegations: { delegates: arrayOfDelegates },
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
    let sortName = within(delegatesTable).getByTestId('delegatesTable.sort.name');
    let sortIcon = within(sortName).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testStore.getState().delegationsState.sortDelegates).toStrictEqual({
        order: 'asc',
        orderBy: 'name',
      });
    });
    let delegatesRows = getAllByTestId('delegatesTable.row');
    let sortedDelegates = sortDelegations('asc', 'name', arrayOfDelegates) as Array<Delegate>;
    delegatesRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegates[index].delegate?.displayName!);
    });
    // sort by name desc
    delegatesTable = getByTestId('delegatesTable');
    sortName = within(delegatesTable).getByTestId('delegatesTable.sort.name');
    sortIcon = within(sortName).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testStore.getState().delegationsState.sortDelegates).toStrictEqual({
        order: 'desc',
        orderBy: 'name',
      });
    });
    delegatesRows = getAllByTestId('delegatesTable.row');
    sortedDelegates = sortDelegations('desc', 'name', arrayOfDelegates) as Array<Delegate>;
    delegatesRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegates[index].delegate?.displayName!);
    });
    // sort by endDate asc
    delegatesTable = getByTestId('delegatesTable');
    const sortEndDate = within(delegatesTable).getByTestId('delegatesTable.sort.endDate');
    sortIcon = within(sortEndDate).getByTestId('ArrowDownwardIcon');
    fireEvent.click(sortIcon);
    await waitFor(() => {
      expect(testStore.getState().delegationsState.sortDelegates).toStrictEqual({
        order: 'asc',
        orderBy: 'endDate',
      });
    });
    delegatesRows = getAllByTestId('delegatesTable.row');
    sortedDelegates = sortDelegations('asc', 'endDate', arrayOfDelegates) as Array<Delegate>;
    delegatesRows.forEach((row, index) => {
      expect(row).toHaveTextContent(sortedDelegates[index].delegate?.displayName!);
    });
  });

  it('shows verification code', async () => {
    const { getByTestId, getAllByTestId } = render(<Delegates />, {
      preloadedState: {
        delegationsState: {
          delegations: { delegates: arrayOfDelegates },
        },
      },
    });
    // get first row
    const delegatesRows = getAllByTestId('delegatesTable.row');
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
    const codeInputs = dialog?.querySelectorAll('input');
    const codes = arrayOfDelegates[0].verificationCode.split('');
    codeInputs?.forEach((input, index) => {
      expect(input).toHaveValue(codes[index]);
    });
  });
});
