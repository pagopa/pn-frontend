import React from 'react';

import { render } from '../../../../test-utils';
import SmartBodyCell from '../SmartBodyCell';

describe('SmartBodyCell Component', () => {
  it('render component', () => {
    const { container } = render(
      <SmartBodyCell columnId={'mock-column-id'} tableProps={{}}>
        mock-column-label
      </SmartBodyCell>
    );
    expect(container).toHaveTextContent(/mock-column-label/);
  });
});
