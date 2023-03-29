import React from 'react';
import { render } from '../../test-utils';
import CustomH3 from '../CustomH3';

describe('CustomH3 element', () => {
  it('render component', () => {
    const result = render(<CustomH3>mock-text</CustomH3>);
    const h3tag = result.container.querySelector('h3');
    expect(h3tag).toBeInTheDocument();
    expect(h3tag).toHaveStyle({
      'font-size': '24px',
      'font-weight': 600,
      'margin-top': 0,
    });
    expect(result.container).toHaveTextContent(/mock-text/);
  });
});
