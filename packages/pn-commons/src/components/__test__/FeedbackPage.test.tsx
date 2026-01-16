import { vi } from 'vitest';

import { fireEvent, render } from '../../test-utils';
import FeedbackPage from '../FeedbackPage';

vi.mock('@pagopa/mui-italia', () => ({
  IllusCompleted: () => <div data-testid="success-illustration" />,
  IllusError: () => <div data-testid="error-illustration" />,
}));

describe('FeedbackPage', () => {
  let onClickHandler = vi.fn();

  beforeEach(() => {
    onClickHandler.mockClear();
  });

  it('renders component', () => {
    const { getByRole, getByText } = render(
      <FeedbackPage
        outcome="error"
        title="Error title"
        description="Error description"
        action={{ text: 'Error action', onClick: onClickHandler }}
      />
    );

    expect(getByRole('heading', { name: /Error title/i })).toBeInTheDocument();
    expect(getByText(/Error description/i)).toBeInTheDocument();
  });

  it('renders success illustration when outcome=success', () => {
    const { getByTestId } = render(
      <FeedbackPage
        outcome="success"
        title="Success title"
        description="Success description"
        action={{ text: 'Success action', onClick: onClickHandler }}
      />
    );

    const illustration = getByTestId('success-illustration');
    expect(illustration).toBeInTheDocument();
  });

  it('renders error illustration when outcome=error', () => {
    const { getByTestId } = render(
      <FeedbackPage
        outcome="error"
        title="Error description"
        action={{ text: 'Error action', onClick: onClickHandler }}
      />
    );

    const illustration = getByTestId('error-illustration');
    expect(illustration).toBeInTheDocument();
  });

  it('fires CTA callback on click', () => {
    const { getByTestId } = render(
      <FeedbackPage
        outcome="error"
        title="Error description"
        action={{ text: 'Error action', onClick: onClickHandler }}
      />
    );

    fireEvent.click(getByTestId('feedback-button'));
    expect(onClickHandler).toHaveBeenCalledTimes(1);
  });
});
