import { render } from '../../../test-utils';
import PNMarkdown from '../PnMarkdown';

describe('PNMarkdown Component', () => {
  it('should not render raw html', () => {
    const { container } = render(<PNMarkdown content="<script>alert('xss')</script>" />);

    expect(container.querySelector('script')).not.toBeInTheDocument();
  });

  it('should render https links with safe attributes', () => {
    const { getByRole } = render(<PNMarkdown content="[PagoPA](https://www.pagopa.it)" />);

    const link = getByRole('link', { name: 'PagoPA' });

    expect(link).toHaveAttribute('href', 'https://www.pagopa.it');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should not render javascript links as clickable links', () => {
    const { queryByRole, getByText } = render(
      <PNMarkdown content="[Click](javascript:alert(1))" />
    );

    expect(queryByRole('link', { name: 'Click' })).not.toBeInTheDocument();
    expect(getByText('Click')).toBeInTheDocument();
  });

  it('should not render non-https links as clickable links', () => {
    const { queryByRole, getByText } = render(<PNMarkdown content="[Mail](mailto:test@test.it)" />);

    expect(queryByRole('link', { name: 'Mail' })).not.toBeInTheDocument();
    expect(getByText('Mail')).toBeInTheDocument();
  });
});
