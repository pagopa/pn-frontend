import { render } from '@testing-library/react';
import DropDownEntiMenuItem from '../DropDownEnti';

describe('DropDownEnti Component', () => {
  it('renders the dropdown menu', () => {
    const result = render(<DropDownEntiMenuItem name={'test1'} />);

    expect(result.baseElement).toHaveTextContent(/test1/i);
  });
});
