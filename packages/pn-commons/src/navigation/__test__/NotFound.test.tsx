import React from 'react';

import { render } from '../../test-utils';
import NotFound from '../NotFound';

describe('NotFound Component', () => {
  it('renders not found', () => {
    // render component
    const result = render(<NotFound />);
    const heading = result?.getByTestId('notFoundTitle');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/404: La pagina che stai cercando non esiste/i);
    const subHeading = result?.getByTestId('notFoundDescription');
    expect(subHeading).toBeInTheDocument();
    expect(subHeading).toHaveTextContent(/Sei qui per errore, prova ad usare la navigazione./i);
  });
});
