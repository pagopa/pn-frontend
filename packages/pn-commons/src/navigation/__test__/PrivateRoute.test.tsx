import React from 'react';

import { render } from '../../test-utils';
import PrivateRoute from '../PrivateRoute';

describe('test PrivateRoute component', () => {
  test('has permissions', () => {
    const result = render(
      <PrivateRoute
        currentRoles={['read', 'write']}
        requiredRoles={['write']}
        redirectTo={'Denied!'}
      >
        Accepted!
      </PrivateRoute>
    );
    expect(result.container).toHaveTextContent('Accepted!');
  });

  test("doesn't have permissions", () => {
    const result = render(
      <PrivateRoute currentRoles={['read']} requiredRoles={['write']} redirectTo={'Denied!'}>
        Accepted!
      </PrivateRoute>
    );
    expect(result.container).toHaveTextContent('Denied!');
  });
});
