import { render } from '@testing-library/react';
import DropDownPartyMenuItem from '../DropDownParty';

describe('DropDownParty Component', () => {
  it('renders the dropdown menu', () => {
    const result = render(<DropDownPartyMenuItem name={'test1'} />);
    expect(result.baseElement).toHaveTextContent(/test1/i);
  });
});
