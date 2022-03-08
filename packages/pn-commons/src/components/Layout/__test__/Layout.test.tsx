import { act, RenderResult } from "@testing-library/react";

import { render } from "../../../test-utils";
import Layout from "../Layout";

jest.mock('../../Header/Header', () => () => <div>Header</div>);
jest.mock('../../Footer/Footer', () => () => <div>Footer</div>);

describe('Layout Component', () => {

  it('renders layout', async () => {

    let result: RenderResult | undefined;
    // render component
    await act(async () => {
      result = render(<Layout sideMenu={<div>Mocked Side Menu</div>}>Mocked Child</Layout>);
    });
    expect(result?.container).toHaveTextContent(/Header/i);
    expect(result?.container).toHaveTextContent(/Footer/i);
    expect(result?.container).toHaveTextContent(/Mocked Child/i);
    expect(result?.container).toHaveTextContent(/Mocked Side Menu/i);
  });
});