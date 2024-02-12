import { axe, render } from '../../../__test__/test-utils';
import DropDownPartyMenuItem from '../DropDownParty';

describe('DropDownParty Component - accessibility tests', () => {
  it('is DropDownParty component accessible', async () => {
    const { container } = render(<DropDownPartyMenuItem name={'test1'} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
