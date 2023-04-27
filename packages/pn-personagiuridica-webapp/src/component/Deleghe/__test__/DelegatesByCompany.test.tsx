import React from 'react';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
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
    expect(table).toHaveTextContent('Marco Verdi');
    expect(table).toHaveTextContent('Davide Legato');
  });

  it('clicks on add button and navigate to new delegation page', () => {
    const result = render(<DelegatesByCompany />);
    const addButton = result.getByTestId('addDeleghe');
    fireEvent.click(addButton);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NUOVA_DELEGA);
  });

  it('visualize modal code and check code', async () => {
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
    const menu = result.getAllByTestId('delegationMenuIcon');
    fireEvent.click(menu[0]);
    const menuOpen = await waitFor(async () => result.getAllByTestId('delegationMenu'));
    expect(menuOpen[0]).toHaveTextContent(/deleghe.show/i);
    fireEvent.click(menuOpen[0].querySelectorAll('[role="menuitem"]')[0]);
    await waitFor(() => {
      const dialog = result.getAllByTestId('codeDialog');
      const arrayOfVerificationCode = arrayOfDelegates[0].verificationCode.split('');
      const inputsValue = dialog[0].getElementsByTagName('input');
      expect(inputsValue[0].value).toBe(arrayOfVerificationCode[0]);
      expect(inputsValue[1].value).toBe(arrayOfVerificationCode[1]);
      expect(inputsValue[2].value).toBe(arrayOfVerificationCode[2]);
      expect(inputsValue[3].value).toBe(arrayOfVerificationCode[3]);
      expect(inputsValue[4].value).toBe(arrayOfVerificationCode[4]);
      expect(inputsValue[5].value).toBe(arrayOfVerificationCode[5]);
    });
  });
});
