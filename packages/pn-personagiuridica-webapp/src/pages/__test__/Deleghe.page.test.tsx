import React from 'react';
import { fireEvent, RenderResult, screen, waitFor } from '@testing-library/react';
import { mockApi, render } from '../../__test__/test-utils';
import Deleghe from '../Deleghe.page';
import { apiClient } from '../../api/apiClients';
import {
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  REVOKE_DELEGATION,
} from '../../api/delegations/delegations.routes';
import { arrayOfDelegates } from '../../redux/delegation/__test__/test.utils';
import DelegatesByCompany from '../../component/Deleghe/DelegatesByCompany';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

/* jest.mock('../../component/Deleghe/DelegatesByCompany', () => ({
  __esModule: true,
  default: () => <div>DelegatesByCompany</div>,
}));
 */

jest.mock('../../component/Deleghe/DelegationsOfTheCompany', () => ({
  __esModule: true,
  default: () => <div>DelegationsOfTheCompany</div>,
}));

describe('Deleghe page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult;

  const renderComponent = async () => {
    result = render(<Deleghe />);
  };

  it('renders deleghe page', async () => {
    await renderComponent();
    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    expect(result.container).toHaveTextContent(/DelegatesByCompany/i);
    expect(result.container).toHaveTextContent(/deleghe.tab_delegati/i);
    expect(result.container).toHaveTextContent(/deleghe.tab_deleghe/i);
    expect(result.container).not.toHaveTextContent(/DelegationsOfTheCompany/i);
  });

  it('test changing tab', async () => {
    await renderComponent();
    const tab2 = result.getByTestId('tab2');
    fireEvent.click(tab2);
    expect(result.container).toHaveTextContent(/DelegationsOfTheCompany/i);
  });

  //TODO
  it.skip('test see modal to revoke and confirm revoking delegates', async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    const result = render(<Deleghe />);
    const delegate = render(<DelegatesByCompany />, {
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
    screen.debug(result.container);
    /* const menu = result.getAllByTestId('delegationMenuIcon');
    fireEvent.click(menu[0]);
    await waitFor(async () => {
      const menuOpen = result.getAllByTestId('delegationMenu');
      expect(menuOpen[0]).toHaveTextContent(/deleghe.revoke/i);
    });
    const menuOpen = result.getAllByTestId('delegationMenu');
    fireEvent.click(
      menuOpen[1].getElementsByClassName(
        'MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters Mui-focusVisible MuiMenuItem-root MuiMenuItem-gutters css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root'
      )[0]
    ); */

    // const table = result.getByTestId('table(notifications)');

    /*  const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('7'), 200, undefined, undefined);
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual({ id: '7' });
    mock.reset();
    mock.restore(); */
  });
});
