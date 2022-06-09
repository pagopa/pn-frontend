import { render } from '@testing-library/react';
import { axe } from '../../../__test__/test-utils';
import DropDownPartyMenuItem from '../../Party/DropDownParty';

describe('DropDownEnti Component', () => {
  it('renders the dropdown menu', () => {
    const result = render(<DropDownPartyMenuItem name={'test1'} />);
    expect(result.baseElement).toHaveTextContent(/test1/i);
  });

  it('is DropDownEnti component accessible', async()=>{
    const result = render(<DropDownPartyMenuItem name={'test1'} />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
