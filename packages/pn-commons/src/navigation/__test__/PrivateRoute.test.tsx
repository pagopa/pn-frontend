import { render } from '../../test-utils';
import PrivateRoute from '../PrivateRoute';

describe('test PrivateRoute component', () => {
  it('has permissions', () => {
    const { container } = render(
      <PrivateRoute
        currentRoles={['read', 'write']}
        requiredRoles={['write']}
        redirectTo={'Denied!'}
      >
        Accepted!
      </PrivateRoute>
    );
    expect(container).toHaveTextContent('Accepted!');
  });

  test("doesn't have permissions", () => {
    const { container } = render(
      <PrivateRoute currentRoles={['read']} requiredRoles={['write']} redirectTo={'Denied!'}>
        Accepted!
      </PrivateRoute>
    );
    expect(container).toHaveTextContent('Denied!');
  });
});
