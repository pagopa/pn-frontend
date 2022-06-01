import { render } from "../../test-utils";
import BreadcrumbLink from "../BreadcrumbLink";

describe('BreadcrumbLink Component', () => {

  it('renders breadcrumb link', () => {
    // render component
    const result = render(<BreadcrumbLink to={'mocked-route'}><p>Mocked Text</p></BreadcrumbLink>);
    expect(result?.container).toHaveTextContent(/Mocked Text/i);
  });
});