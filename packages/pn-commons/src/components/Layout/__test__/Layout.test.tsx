import { render } from "../../../test-utils";
import { loggedUser, productsList } from "../../Header/__test__/test-utils";
import Layout from "../Layout";

jest.mock('../../Header/Header', () => () => <div>Header</div>);
jest.mock('../../Footer/Footer', () => () => <div>Footer</div>);

describe('Layout Component', () => {

  it('renders layout', () => {
    // render component
    const result = render(<Layout sideMenu={<div>Mocked Side Menu</div>} productsList={productsList} loggedUser={loggedUser}>Mocked Child</Layout>);
    expect(result.container).toHaveTextContent(/Header/i);
    expect(result.container).toHaveTextContent(/Footer/i);
    expect(result.container).toHaveTextContent(/Mocked Child/i);
    expect(result.container).toHaveTextContent(/Mocked Side Menu/i);
  });
});