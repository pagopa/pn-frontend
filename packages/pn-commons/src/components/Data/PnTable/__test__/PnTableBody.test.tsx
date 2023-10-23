import React from 'react';

import { Typography } from '@mui/material';

import { Item } from '../../../../models';
import { render } from '../../../../test-utils';
import PnTableBody from '../PnTableBody';
import PnTableBodyCell from '../PnTableBodyCell';
import PnTableBodyRow from '../PnTableBodyRow';

describe('PnTableBody', () => {
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
        <PnTableBody>
          <PnTableBodyRow index={1}>
            <PnTableBodyCell>
              {mockColumn.getCellLabel(mockRow[mockColumn.id as keyof Item], mockRow[0])}
            </PnTableBodyCell>
          </PnTableBodyRow>
        </PnTableBody>
      </table>
    );
    expect(container).toHaveTextContent(/mock-column-value/);
  });
});
