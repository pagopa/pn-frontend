import { render } from '../../../__test__/test-utils';
import SideMenuBanner from '../SideMenuBanner';

describe('SideMenuBanner', () => {
  it('renders component', () => {
    const { getByText, getByRole } = render(<SideMenuBanner />);

    expect(getByText('feedback_banner.title')).toBeInTheDocument();
    expect(getByText('feedback_banner.content')).toBeInTheDocument();

    const link = getByRole('link', { name: /button.start/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
