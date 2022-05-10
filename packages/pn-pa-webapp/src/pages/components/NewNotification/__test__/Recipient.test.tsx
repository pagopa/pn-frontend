import { render } from "../../../../__test__/test-utils";
import Recipient from "../Recipient";

describe('Recipient Component', () => {

  it('renders Recipient', () => {
    // render component
    const result = render(<Recipient />);
    expect(result?.container).toHaveTextContent(/Destinatario/i);
  });
});