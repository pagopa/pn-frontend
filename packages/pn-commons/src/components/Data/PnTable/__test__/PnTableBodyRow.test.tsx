import React from 'react';

import { Typography } from '@mui/material';

import { Item } from '../../../../models';
import { render } from '../../../../test-utils';
import PnTableBodyCell from '../PnTableBodyCell';
import PnTableBodyRow from '../PnTableBodyRow';

describe('PnTableBodyCell', () => {
  const mockColumn = {
    id: 'name',
    label: 'mock-column-label',
    width: '30%',
    sortable: false,
    getCellLabel(value: string, row: Item) {
      return <Typography>mock-column-value</Typography>;
    },
    onClick: () => mockFn(),
  };

  const mockRow: Array<Item> = [
    {
      id: 'name',
    },
  ];

  const mockFn = jest.fn();

  it('render component', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <PnTableBodyCell>
              {mockColumn.getCellLabel(mockRow[mockColumn.id as keyof Item], mockRow[0])}
            </PnTableBodyCell>
          </tr>
        </tbody>
      </table>
    );
    expect(container).toHaveTextContent(/mock-column-value/);
  });
});
