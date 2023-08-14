import React from 'react';

import { createMatchMedia, render } from '../../test-utils';
import { useIsMobile } from '../useIsMobile';

const Component = () => {
  const isMobile = useIsMobile();

  return <div>{JSON.stringify(isMobile)}</div>;
};

describe('test useIsMobile hook', () => {
  test('hook should return false', () => {
    window.matchMedia = createMatchMedia(2000);
    const result = render(<Component />);
    expect(result.container).toHaveTextContent('false');
  });

  test('hook should return true', () => {
    window.matchMedia = createMatchMedia(800);
    const result = render(<Component />);
    expect(result.container).toHaveTextContent('true');
  });
});
