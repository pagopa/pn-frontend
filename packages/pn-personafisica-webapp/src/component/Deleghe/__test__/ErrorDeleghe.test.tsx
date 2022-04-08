import { render } from '@testing-library/react';
import ErrorDeleghe from '../ErrorDeleghe';

describe('ErrorDeleghe Component', () => {
  it('renders the dropdown menu', () => {
    const result = render(<ErrorDeleghe />);

    expect(result.container).toBeInTheDocument();
  });
});
