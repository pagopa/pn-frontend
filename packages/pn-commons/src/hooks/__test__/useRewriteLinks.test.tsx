import React from 'react';

import { render, waitFor } from '@testing-library/react';

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
  it('hook set new href', async () => {
    const result = render(<Component></Component>);
    const link = await result.findByRole('link');
    waitFor(() => {
      expect(link).toHaveAttribute('href', `${ROUTE}#abc-123`);
    });
  });
});
