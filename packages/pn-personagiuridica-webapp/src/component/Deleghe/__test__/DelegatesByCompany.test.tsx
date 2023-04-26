import React from 'react';

import { fireEvent, render } from '../../../__test__/test-utils';
import { arrayOfDelegates } from '../../../redux/delegation/__test__/test.utils';
import * as routes from '../../../navigation/routes.const';
import DelegatesByCompany from '../DelegatesByCompany';

const mockNavigateFn = jest.fn();

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

describe('Delegates Component - assuming delegates API works properly', () => {
  afterAll(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('renders the empty state', () => {
    const result = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: [],
          },
        },
      },
    });

    expect(result.container).toHaveTextContent(/deleghe.delegatesTitle/i);
    const addButton = result.getByTestId('addDeleghe');
    expect(addButton).toBeInTheDocument();
    expect(result.container).toHaveTextContent(/deleghe.add/i);
    expect(result.container).toHaveTextContent(/deleghe.no_delegates/i);
  });

  it('render table with data', async () => {
    const result = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: arrayOfDelegates,
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
  });

  it('clicks on add button and navigate to new delegation page', () => {
    const result = render(<DelegatesByCompany />);
    const addButton = result.getByTestId('addDeleghe');
    fireEvent.click(addButton);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NUOVA_DELEGA);
  });
});
