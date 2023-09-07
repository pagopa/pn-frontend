import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { arrayOfDelegates } from '../../../__mocks__/Delegations.mock';
import { RenderResult, fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { REVOKE_DELEGATION } from '../../../api/delegations/delegations.routes';
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
  let mock: MockAdapter;
  let result: RenderResult;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    mock.restore();
  });

  it('renders the empty state', () => {
    result = render(<DelegatesByCompany />, {
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
    result = render(<DelegatesByCompany />, {
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
    result = render(<DelegatesByCompany />);
    const addButton = result.getByTestId('addDeleghe');
    fireEvent.click(addButton);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NUOVA_DELEGA);
  });

  it('visualize modal code and check code', async () => {
    result = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: arrayOfDelegates,
          },
        },
      },
    });
    const menu = result.getAllByTestId('delegationMenuIcon');
    fireEvent.click(menu[0]);
    const menuOpen = await waitFor(async () => result.getByTestId('delegationMenu'));
    const menuItems = menuOpen.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent(/deleghe.show/i);
    fireEvent.click(menuItems[0]);
    await waitFor(() => {
      const dialog = result.getByTestId('codeDialog');
      const arrayOfVerificationCode = arrayOfDelegates[0].verificationCode.split('');
      const codeInputs = dialog?.querySelectorAll('input');
      codeInputs?.forEach((input, index) => {
        expect(input).toHaveValue(arrayOfVerificationCode[index]);
      });
    });
  });

  it('revoke mandate', async () => {
    mock.onPatch(REVOKE_DELEGATION(arrayOfDelegates[0].mandateId)).reply(204);
    result = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: arrayOfDelegates,
            delegators: [],
          },
        },
      },
    });
    const menu = result.getAllByTestId('delegationMenuIcon');
    fireEvent.click(menu[0]);
    const menuOpen = await waitFor(async () => result.getByTestId('delegationMenu'));
    const menuItems = menuOpen.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[1]).toHaveTextContent(/deleghe.revoke/i);
    fireEvent.click(menuItems[1]);
    const dialog = await waitFor(() => result.getByTestId('confirmationDialog'));
    expect(dialog).toBeInTheDocument();
    const dialogAction = within(dialog).getAllByTestId('dialogAction');
    // click on confirm button
    fireEvent.click(dialogAction[1]);
    await waitFor(() => {
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toContain(
        `mandate/api/v1/mandate/${arrayOfDelegates[0].mandateId}/revoke`
      );
      expect(dialog).not.toBeInTheDocument();
    });
    const table = result.getByTestId('table(notifications)');
    expect(table).toBeInTheDocument();
    expect(table).not.toHaveTextContent('Marco Verdi');
    expect(table).toHaveTextContent('Davide Legato');
  });
});
