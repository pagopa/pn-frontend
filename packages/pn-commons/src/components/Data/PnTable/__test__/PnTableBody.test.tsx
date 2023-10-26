import React from 'react';

import { Typography } from '@mui/material';

import { Item } from '../../../../models';
import { render } from '../../../../test-utils';
import PnTableBody from '../PnTableBody';
import PnTableBodyCell from '../PnTableBodyCell';
import PnTableBodyRow from '../PnTableBodyRow';

describe('PnTableBody', () => {
  it('render component', () => {
    const { container, queryAllByRole } = render(
      <table>
        <PnTableBody>
          <PnTableBodyRow index={1}>
            <PnTableBodyCell>mocked-cell-content</PnTableBodyCell>
          </PnTableBodyRow>
        </PnTableBody>
      </table>
    );
    expect(container).toHaveTextContent(/mocked-cell-content/);
    const buttons = queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });
});
