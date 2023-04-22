import { fireEvent, mockApi, render, screen, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { DELEGATIONS_BY_DELEGATE } from '../../../api/delegations/delegations.routes';
import { arrayOfDelegates } from '../../../redux/delegation/__test__/test.utils';
import { store } from '../../../redux/store';
import DelegatesByCompany from '../DelegatesByCompany';
import React from 'react';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Delegates Component - assuming delegates API works properly', () => {
  it('renders the empty state', () => {
    const mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATE(), 200, undefined, []);
    const result = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: [],
          },
          sortDelegates: {
            orderBy: '',
            order: 'asc',
          },
        },
      },
    });

    expect(result.container).toHaveTextContent(/deleghe.delegatesTitle/i);
    const addButton = result.getByTestId('addDeleghe');
    expect(addButton).toBeInTheDocument();
    expect(result.container).toHaveTextContent(/deleghe.add/i);
    expect(result.container).toHaveTextContent(/deleghe.no_delegates/i);
    mock.reset();
    mock.restore();
  });

  it('render table with data', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      DELEGATIONS_BY_DELEGATE(),
      200,
      undefined,
      arrayOfDelegates
    );
    const result = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: arrayOfDelegates,
          },
          sortDelegates: {
            orderBy: '',
            order: 'desc',
          },
        },
      },
    });

    expect(result.container).not.toHaveTextContent(/deleghe.no_delegates/i);
    const table = result.getByTestId('table(notifications)');
    expect(table).toBeInTheDocument();
    expect(result.container).toHaveTextContent('Davide');
    expect(result.container).toHaveTextContent('Marco');
    const col = table.getElementsByClassName(
      'MuiTableCell-root MuiTableCell-head MuiTableCell-stickyHeader MuiTableCell-alignCenter MuiTableCell-sizeMedium css-t7iuwh-MuiTableCell-root'
    );
    const row = table.getElementsByClassName('MuiTableBody-root css-1nq9kkf-MuiTableBody-root');
    const indexOrder1 = row[0].getElementsByTagName('p')[0].innerHTML;
    const indexOrder2 = row[0].getElementsByTagName('p')[2].innerHTML;
    expect(indexOrder1).toBe('Marco Verdi');
    expect(indexOrder2).toBe('Davide Legato');

    fireEvent.click(col[0]);
    await waitFor(() => {
      console.log('arrayOfDelegates :>> ', arrayOfDelegates);
      /* expect(indexOrder1).toBe('Davide Legato');
      expect(indexOrder2).toBe('Marco Verdi'); */
    });
    mock.reset();
    mock.restore();
  });
});
