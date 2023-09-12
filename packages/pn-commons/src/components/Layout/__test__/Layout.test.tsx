import React from 'react';

import { Email } from '@mui/icons-material';

import SideMenu from '../../../components/SideMenu/SideMenu';
import { render } from '../../../test-utils';
import { SideMenuItem } from '../../../types';
import { loggedUser, productsList } from '../../Header/__test__/test-utils';
import Layout from '../Layout';

describe('Layout Component', () => {
  const menuItems: Array<SideMenuItem> = [
    {
      label: 'menu-1',
      icon: Email,
      route: 'route-mock-1',
    },
    {
      label: 'menu-2',
      icon: Email,
      route: 'route-mock-2',
    },
    {
      label: 'menu-3',
      icon: Email,
      route: 'route-mock-3',
    },
  ];
  it('renders layout', () => {
    // render component
    const result = render(
      <Layout
        sideMenu={<SideMenu menuItems={menuItems} />}
        productsList={productsList}
        loggedUser={loggedUser}
      >
        <div data-testid="mockedChild">Mocked Child</div>
      </Layout>
    );
    // check for mui-header;
    expect(result.container).toHaveTextContent(/PagoPA S.p.A.AssistenzaEsci/i);

    // check for mui-footer
    expect(result.container).toHaveTextContent(/PagoPA S.p.A. — società per azioni/i);

    // check for sidemenu
    const sideMenu = result.getByTestId('sideMenu');
    expect(sideMenu).toHaveTextContent(/menu-1menu-2menu-3/i);

    // check for layout children
    const mockedChildren = result.getByTestId('mockedChild');
    expect(mockedChildren).toHaveTextContent(/Mocked Child/i);
  });
});
