import React from 'react';

import { render } from '../../../../test-utils';
import PnTableBodyCell from '../PnTableBodyCell';
import PnTableBodyRow from '../PnTableBodyRow';

describe('PnTableBodyRow', () => {
  it('render component', () => {
    const { container } = render(
      <table>
        <tbody>
          <PnTableBodyRow index={1}>
            <PnTableBodyCell>mocked-cell-content</PnTableBodyCell>
          </PnTableBodyRow>
        </tbody>
      </table>
    );
    expect(container).toHaveTextContent(/mocked-cell-content/);
  });
});
