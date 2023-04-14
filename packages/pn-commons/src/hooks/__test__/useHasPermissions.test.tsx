import React from 'react';

import { render } from '../../test-utils';
import { useHasPermissions } from '../useHasPermissions';

const Component = ({ currentPermissions }: { currentPermissions: Array<string> }) => {
  const hasPermissions = useHasPermissions(currentPermissions, ['write']);
  if (hasPermissions) {
    return <div>Accepted!</div>;
  }
  return <div>Denied!</div>;
};

describe('test usePermissions hook', () => {
  test('has permissions', () => {
    const result = render(<Component currentPermissions={['read', 'write']} />);
    expect(result.container).toHaveTextContent('Accepted!');
  });

  test("doesn't have permissions", () => {
    const result = render(<Component currentPermissions={['read']} />);
    expect(result.container).toHaveTextContent('Denied!');
  });
});
