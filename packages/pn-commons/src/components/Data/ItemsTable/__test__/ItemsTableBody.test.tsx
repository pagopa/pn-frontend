import React from 'react';

import { Typography } from '@mui/material';

import { render } from '../../../../test-utils';
import { Item } from '../../../../types';
import ItemsTableBody from '../ItemsTableBody';
import ItemsTableBodyCell from '../ItemsTableBodyCell';
import ItemsTableBodyRow from '../ItemsTableBodyRow';

describe('ItemsTableBody', () => {
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
        <ItemsTableBody>
          <ItemsTableBodyRow index={1}>
            <ItemsTableBodyCell>
              {mockColumn.getCellLabel(mockRow[mockColumn.id as keyof Item], mockRow[0])}
            </ItemsTableBodyCell>
          </ItemsTableBodyRow>
        </ItemsTableBody>
      </table>
    );
    expect(container).toHaveTextContent(/mock-column-value/);
  });
});
