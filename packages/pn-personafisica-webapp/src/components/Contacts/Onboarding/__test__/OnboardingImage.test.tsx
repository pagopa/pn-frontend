import { render } from '../../../../__test__/test-utils';
import OnboardingImage from '../OnboardingImage';

describe('OnboardingImage', () => {
  it('renders an image with the correct src', () => {
    const { getByRole } = render(<OnboardingImage src="/test.png" />);

    const img = getByRole('presentation', { hidden: true });
    expect(img).toHaveAttribute('src', '/test.png');
  });

  it('renders as decorative by default', () => {
    const { getByRole } = render(<OnboardingImage src="/test.png" />);

    const img = getByRole('presentation', { hidden: true });

    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders as informative image when decorative is false', () => {
    const { getByRole } = render(
      <OnboardingImage src="/test.png" alt="example" decorative={false} />
    );

    const img = getByRole('img');

    expect(img).toHaveAttribute('alt', 'example');
    expect(img).not.toHaveAttribute('aria-hidden');
  });
});
