import MockAdapter from 'axios-mock-adapter';
import React, { ReactNode } from 'react';

import { arrayOfDelegates } from '../../../__mocks__/Delegations.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
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
  Trans: (props: { i18nKey: string; components?: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components!.map((c) => c)}
    </>
  ),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

describe('Delegates Component - assuming delegates API works properly', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    jest.clearAllMocks();
    mock.restore();
  });

  it('renders the empty state', () => {
    const { container, getByTestId } = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: [],
          },
        },
      },
    });
    expect(container).toHaveTextContent(/deleghe.delegatesTitle/i);
    const addButton = getByTestId('addDeleghe');
    expect(addButton).toBeInTheDocument();
    expect(container).toHaveTextContent(/deleghe.add/i);
    expect(container).toHaveTextContent(/deleghe.no_delegates/i);
    // clicks on empty state action
    const button = getByTestId('link-add-delegate');
    fireEvent.click(button);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NUOVA_DELEGA);
  });

  it('render table with data', async () => {
    const { container, getByTestId, getAllByTestId } = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: arrayOfDelegates,
          },
        },
      },
    });
    expect(container).not.toHaveTextContent(/deleghe.no_delegates/i);
    const table = getByTestId('table(notifications)');
    expect(table).toBeInTheDocument();
    const rows = getAllByTestId('table(notifications).row');
    expect(rows).toHaveLength(arrayOfDelegates.length);
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(arrayOfDelegates[index].delegate?.displayName!);
    });
  });

  it('clicks on add button and navigate to new delegation page', () => {
    const { getByTestId } = render(<DelegatesByCompany />);
    const addButton = getByTestId('addDeleghe');
    fireEvent.click(addButton);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NUOVA_DELEGA);
  });

  it('visualize modal code and check code', async () => {
    const { getAllByTestId, getByTestId } = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: arrayOfDelegates,
          },
        },
      },
    });
    const menu = getAllByTestId('delegationMenuIcon');
    fireEvent.click(menu[0]);
    const menuOpen = await waitFor(async () => getByTestId('delegationMenu'));
    const menuItems = menuOpen.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent(/deleghe.show/i);
    fireEvent.click(menuItems[0]);
    await waitFor(() => {
      const dialog = getByTestId('codeDialog');
      const arrayOfVerificationCode = arrayOfDelegates[0].verificationCode.split('');
      const codeInputs = dialog?.querySelectorAll('input');
      codeInputs?.forEach((input, index) => {
        expect(input).toHaveValue(arrayOfVerificationCode[index]);
      });
    });
  });

  it('revoke mandate', async () => {
    mock.onPatch(REVOKE_DELEGATION(arrayOfDelegates[0].mandateId)).reply(204);
    const { getAllByTestId, getByTestId } = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: arrayOfDelegates,
            delegators: [],
          },
        },
      },
    });
    const menu = getAllByTestId('delegationMenuIcon');
    fireEvent.click(menu[0]);
    const menuOpen = await waitFor(async () => getByTestId('delegationMenu'));
    const menuItems = menuOpen.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[1]).toHaveTextContent(/deleghe.revoke/i);
    fireEvent.click(menuItems[1]);
    const dialog = await waitFor(() => getByTestId('confirmationDialog'));
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
    const table = getByTestId('table(notifications)');
    expect(table).toBeInTheDocument();
    const rows = getAllByTestId('table(notifications).row');
    expect(rows).toHaveLength(arrayOfDelegates.length - 1);
    // the index + 1 is because wie revoke the first delegation
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(arrayOfDelegates[index + 1].delegate?.displayName!);
    });
  });
});
