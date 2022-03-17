import { render } from "../../../../test-utils";
import SubHeader from "../SubHeader";

describe('Header Component', () => {

  it('renders sub header', () => {
    // render component
    const result = render(<SubHeader />);
    const header = result?.container.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/Piattaforma Notifiche/i);
    expect(header).toHaveTextContent(/Gestisci le tue notifiche/i);
  });
});