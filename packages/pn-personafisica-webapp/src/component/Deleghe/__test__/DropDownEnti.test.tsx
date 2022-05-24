import { render } from '@testing-library/react';
import { axe } from '../../../__test__/test-utils';
import DropDownEntiMenuItem from '../DropDownEnti';

describe('DropDownEnti Component', () => {
  it('renders the dropdown menu', () => {
    const result = render(<DropDownEntiMenuItem name={'test1'} />);
    expect(result.baseElement).toHaveTextContent(/test1/i);
  });

  it('is DropDownEnti component accessible', async()=>{
    const result = render(<DropDownEntiMenuItem name={'test1'} />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
