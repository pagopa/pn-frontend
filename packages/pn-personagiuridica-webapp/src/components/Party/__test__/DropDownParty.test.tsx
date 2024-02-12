import { render } from '../../../__test__/test-utils';
import DropDownPartyMenuItem from '../DropDownParty';

describe('DropDownParty Component', () => {
  it('renders the dropdown menu', () => {
    const result = render(<DropDownPartyMenuItem name={'test1'} />);
    expect(result.baseElement).toHaveTextContent(/test1/i);
  });
});
