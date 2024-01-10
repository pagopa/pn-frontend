import { render, waitFor } from '../../test-utils';
import { useRewriteLinks } from '../useRewriteLinks';

const ROUTE = '/informativa-privacy';

const Component = () => {
  useRewriteLinks(true, ROUTE, '.otnotice-content');
  return (
    <div>
      <a className=".otnotice-content" href="#abc-123"></a>
    </div>
  );
};

describe('test useRewriteLinks hook', () => {
  it('hook set new href', () => {
    const { getByRole } = render(<Component />);
    const link = getByRole('link');
    waitFor(() => {
      expect(link).toHaveAttribute('href', `${ROUTE}#abc-123`);
    });
  });
});
