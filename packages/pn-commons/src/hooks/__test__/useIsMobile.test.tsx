import React from 'react';

import { createMatchMedia, render } from '../../test-utils';
import { useIsMobile } from '../useIsMobile';

const Component = () => {
  const isMobile = useIsMobile();

  return <div>{JSON.stringify(isMobile)}</div>;
};

describe('test useIsMobile hook', () => {
  const original = window.matchMedia;

  afterAll(() => {
    window.matchMedia = original;
  });

  it('hook should return false', () => {
    const result = render(<Component />);
    expect(result.container).toHaveTextContent('false');
  });

  it('hook should return true', () => {
    window.matchMedia = createMatchMedia(800);
    const result = render(<Component />);
    expect(result.container).toHaveTextContent('true');
  });
});
