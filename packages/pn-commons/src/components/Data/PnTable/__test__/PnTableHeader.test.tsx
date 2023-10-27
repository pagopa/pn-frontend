import React from 'react';

import { render } from '../../../../test-utils';
import PnTableHeader from '../PnTableHeader';
import PnTableHeaderCell from '../PnTableHeaderCell';

describe('PnTableHeaderCell', () => {
  it('render component', () => {
    const { container } = render(
      <table>
        <PnTableHeader>
          <PnTableHeaderCell columnId={'mock-column-id'}>mock-column-label</PnTableHeaderCell>
        </PnTableHeader>
      </table>
    );
    expect(container).toHaveTextContent(/mock-column-label/);
  });
});
