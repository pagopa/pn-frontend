import { render } from "../../test-utils";
import NotFound from "../NotFound";

describe('NotFound Component', () => {

  it('renders not found', () => {
    // render component
    const result = render(<NotFound />);
    const heading = result?.container.querySelector('h4');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/404: La pagina che stai cercando non esiste/i);
    const subHeading = result?.container.querySelector('h6');
    expect(subHeading).toBeInTheDocument();
    expect(subHeading).toHaveTextContent(/Sei qui per errore, prova ad usare la navigazione./i);
  });
});