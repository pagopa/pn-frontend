import { render } from '../../test-utils';
import InlineErrorMessage from '../InlineErrorMessage';

describe('InlineErrorMessage Component', () => {
  const message = 'Required field';
  it('renders the provided message', () => {
    const { getByText } = render(<InlineErrorMessage message={message} />);

    expect(getByText(message)).toBeInTheDocument();
  });

  it('renders an alert for screen readers', () => {
    const { getByRole } = render(<InlineErrorMessage message={message} />);

    const alert = getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(message);
  });

  it('renders the icon as decorative (aria-hidden)', () => {
    const { container } = render(<InlineErrorMessage message={message} />);

    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });

  it('renders the default error color on container, text and icon', () => {
    const { container, getByRole, getByText } = render(<InlineErrorMessage message={message} />);

    const alert = getByRole('alert');
    const text = getByText(message);
    const icon = container.querySelector('svg');

    expect(alert).toHaveStyle({ color: '#D13333' });
    expect(text).toHaveStyle({ color: '#D13333' });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle({ color: '#D13333' });
  });

  it('applies the custom color to the alert container', () => {
    const { getByRole } = render(<InlineErrorMessage message={message} color="#FFF" />);

    expect(getByRole('alert')).toHaveStyle({ color: '#FFF' });
  });

  it('applies custom sx to the alert container', () => {
    const { getByRole } = render(<InlineErrorMessage message={message} sx={{ ml: 2, mt: 1 }} />);

    expect(getByRole('alert')).toHaveStyle({
      marginLeft: '16px',
      marginTop: '8px',
    });
  });
});
