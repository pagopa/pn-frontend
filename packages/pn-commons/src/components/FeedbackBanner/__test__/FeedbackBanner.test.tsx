import { vi } from 'vitest';

import { fireEvent, render } from '../../../test-utils';
import FeedbackBanner from '../FeedbackBanner';

describe('FeedbackBanner', () => {
  it('renders component', () => {
    const { getByText } = render(
      <FeedbackBanner
        title="Title"
        content="Content"
        action={{ kind: 'button', text: 'Action', onClick: vi.fn() }}
      />
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
        action={{ kind: 'button', text: 'Action', onClick: vi.fn() }}
      />
    );

    const customContent = getByTestId('custom-content');
    expect(customContent).toBeInTheDocument();
    expect(customContent).toHaveTextContent('Custom content');
  });

  it('renders link action when kind is "link"', () => {
    const url = 'https://www.test.com/feedback';
    const { getByRole } = render(
      <FeedbackBanner
        title="Title"
        content="Content"
        action={{
          kind: 'link',
          text: 'Action',
          href: url,
          target: '_blank',
        }}
      />
    );

    const link = getByRole('link', { name: 'Action' });
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders button action and calls onClick when kind is "button"', () => {
    const onClick = vi.fn();

    const { getByRole } = render(
      <FeedbackBanner
        title="Title"
        content="Content"
        action={{ kind: 'button', text: 'Action', onClick }}
      />
    );

    const button = getByRole('button', { name: 'Action' });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);

    // sanity check: it's a button, not a link
    expect(button.tagName.toLowerCase()).toBe('button');
  });

  it('uses aria-label when ariaLabel prop is provided', () => {
    const { getByRole } = render(
      <FeedbackBanner
        title="Title"
        content="Content"
        ariaLabel="Banner feedback"
        action={{ kind: 'button', text: 'Action', onClick: vi.fn() }}
      />
    );

    // Card is a <section> with role="region" when aria-label/aria-labelledby is provided
    const region = getByRole('region', { name: 'Banner feedback' });
    expect(region).toBeInTheDocument();
  });

  it('links aria-labelledby to the title element when ariaLabel is not provided', () => {
    const { getByRole, getByText } = render(
      <FeedbackBanner
        title="Title"
        content="Content"
        action={{ kind: 'button', text: 'Action', onClick: vi.fn() }}
      />
    );

    const region = getByRole('region');
    const heading = getByText('Title');

    expect(heading).toHaveAttribute('id');
    const titleId = heading.getAttribute('id');
    expect(titleId).not.toBeNull();

    expect(region).toHaveAttribute('aria-labelledby', titleId);
  });

  it('applies slotProps.card', () => {
    const { getByTestId } = render(
      <FeedbackBanner
        title="Title"
        content="Content"
        action={{ kind: 'button', text: 'Action', onClick: vi.fn() }}
        slotProps={{
          card: { 'data-testid': 'feedback-banner-card' },
        }}
      />
    );

    const card = getByTestId('feedback-banner-card');
    expect(card).toBeInTheDocument();
  });
});
