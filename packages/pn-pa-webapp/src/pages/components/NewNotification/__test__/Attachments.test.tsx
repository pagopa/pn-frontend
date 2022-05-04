import { render } from "../../../../__test__/test-utils";
import Attachments from "../Attachments";

describe('Attachments Component', () => {

  it('renders Attachments', () => {
    // render component
    const result = render(<Attachments />);
    expect(result?.container).toHaveTextContent(/Allegati/i);
  });
});