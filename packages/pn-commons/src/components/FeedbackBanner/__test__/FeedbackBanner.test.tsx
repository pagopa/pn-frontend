import { render } from '../../../test-utils';
import FeedbackBanner from '../FeedbackBanner';

describe('FeedbackBanner', () => {
  const url = 'https://www.test.com/feedback';
  it('renders component', () => {
    const { getByText } = render(
      <FeedbackBanner title="Title" content="Content" action={{ text: 'Action', href: url }} />
    );

    expect(getByText('Title')).toBeInTheDocument();
    expect(getByText('Content')).toBeInTheDocument();
    expect(getByText('Action')).toBeInTheDocument();
  });

  it('renders content when a ReactNode is passed', () => {
    const { getByTestId } = render(
      <FeedbackBanner
        title="Title"
        content={<span data-testid="custom-content">Custom content</span>}
        action={{ text: 'Action', href: url }}
      />
    );

    const customContent = getByTestId('custom-content');
    expect(customContent).toBeInTheDocument();
    expect(customContent).toHaveTextContent('Custom content');
  });

  it('renders link action properly', () => {
    const { getByRole } = render(
      <FeedbackBanner
        title="Title"
        content="Content"
        action={{
          text: 'Action',
          href: url,
          target: '_blank',
        }}
      />
    );

    const link = getByRole('link', { name: /Action/ });
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
