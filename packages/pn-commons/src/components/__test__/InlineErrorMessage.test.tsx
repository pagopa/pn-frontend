import { getById, render } from '../../test-utils';
import InlineErrorMessage from '../InlineErrorMessage';

describe('InlineErrorMessage Component', () => {
  const message = 'Required field';
  it('renders the provided message', () => {
    const { getByText } = render(<InlineErrorMessage id="fake-id" message={message} />);

    expect(getByText(message)).toBeInTheDocument();
  });

  it('renders an alert for screen readers', () => {
    const { container } = render(<InlineErrorMessage id="fake-id" message={message} />);

    const alert = getById(container, 'fake-id');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(message);
  });

  it('renders the icon as decorative (aria-hidden)', () => {
    const { container } = render(<InlineErrorMessage id="fake-id" message={message} />);

    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });

  it('renders the default error color on container, text and icon', () => {
    const { container, getByText } = render(<InlineErrorMessage id="fake-id" message={message} />);

    const alert = getById(container, 'fake-id');
    const text = getByText(message);
    const icon = container.querySelector('svg');

    expect(alert).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  it('applies custom sx to the alert container', () => {
    const { container } = render(
      <InlineErrorMessage id="fake-id" message={message} sx={{ ml: 2, mt: 1 }} />
    );

    const alert = getById(container, 'fake-id');
    expect(alert).toHaveStyle({
      marginLeft: '16px',
      marginTop: '8px',
    });
  });
});
