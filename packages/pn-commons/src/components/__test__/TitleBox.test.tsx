import { render } from '../../test-utils';
import TitleBox from '../TitleBox';

describe('test TitleBox component', () => {
  it('renders the full component', () => {
    const { container } = render(<TitleBox title={'Test title'} subTitle={'Test subtitle'} />);
    expect(container).toHaveTextContent(/test title/i);
    expect(container).toHaveTextContent(/test subtitle/i);
  });
});
