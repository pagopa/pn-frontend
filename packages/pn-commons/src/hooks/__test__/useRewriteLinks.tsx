import { render } from '@testing-library/react';
import React from 'react';

const Component = () => {
  return (
    <div>
      <a className=".otnotice-content" href="#abc-123"></a>
    </div>
  );
};

const ROUTE = '/informativa-privacy';

const editHref = (link: HTMLElement, route: String) => {
  const href = link.getAttribute('href');
  if (href?.startsWith('#')) {
    const newHref = `${route}${href}`;
    link.setAttribute('href', newHref);
  }
};

describe('test useDocumentUnauthorized hook', () => {
  test('hook set new href', async () => {
    const result = render(<Component></Component>);
    const link = await result.findByRole('link');
    editHref(link, ROUTE);
    expect(link).toHaveAttribute('href', `${ROUTE}#abc-123`);
  });
});
