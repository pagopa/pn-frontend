import { render } from "../../../../__test__/test-utils";
import PaymentMethods from "../PaymentMethods";

describe('PaymentMethods Component', () => {

  it('renders PaymentMethods', () => {
    // render component
    const result = render(<PaymentMethods />);
    expect(result?.container).toHaveTextContent(/Metodi di pagamento/i);
  });
});