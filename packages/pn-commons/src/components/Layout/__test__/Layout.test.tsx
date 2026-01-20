import { Email } from '@mui/icons-material';

import { loggedUser, productsList } from '../../../__mocks__/User.mock';
import SideMenu from '../../../components/SideMenu/SideMenu';
import { SideMenuItem } from '../../../models/SideMenuItem';
import { render } from '../../../test-utils';
import Layout from '../Layout';

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

describe('Layout Component', () => {
  it('renders layout', () => {
    // render component
    const { container, getByTestId } = render(
      <Layout
        currentLanguage={'it'}
        sideMenu={<SideMenu menuItems={menuItems} />}
        productsList={productsList}
        loggedUser={loggedUser}
        accessibilityLink="link-test"
      >
        <div data-testid="mockedChild">Mocked Child</div>
      </Layout>
    );
    // check for mui-header;
    expect(container).toHaveTextContent(/PagoPA S.p.A.AssistenzaEsci/i);
    // check for mui-footer
    expect(container).toHaveTextContent(/PagoPA S.p.A. — società per azioni/i);
    // check for sidemenu
    const sideMenu = getByTestId('sideMenu');
    expect(sideMenu).toHaveTextContent(/menu-1menu-2menu-3/i);
    // check for layout children
    const mockedChildren = getByTestId('mockedChild');
    expect(mockedChildren).toHaveTextContent(/Mocked Child/i);
  });
});
