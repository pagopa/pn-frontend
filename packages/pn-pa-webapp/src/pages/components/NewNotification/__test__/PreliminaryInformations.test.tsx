import { render } from "../../../../__test__/test-utils";
import PreliminaryInformations from "../PreliminaryInformations";

describe('PreliminaryInformations Component', () => {

  it('renders PreliminaryInformations', () => {
    // render component
    const result = render(<PreliminaryInformations />);
    expect(result?.container).toHaveTextContent(/Informazioni preliminari/i);
  });
});