import React from 'react';

import { render, waitFor } from '../../test-utils';
import { rewriteLinks } from '../onetrust.utility';

const ROUTE = '/informativa-privacy';

const Component = () => {
  rewriteLinks(ROUTE, '.otnotice-content');
  return (
    <div>
      <a className=".otnotice-content" href="#abc-123"></a>
    </div>
  );
};

describe('test rewrite links', () => {
  it('function set new href', () => {
    const { getByRole } = render(<Component />);
    const link = getByRole('link');
    waitFor(() => {
      expect(link).toHaveAttribute('href', `${ROUTE}#abc-123`);
    });
  });
});
