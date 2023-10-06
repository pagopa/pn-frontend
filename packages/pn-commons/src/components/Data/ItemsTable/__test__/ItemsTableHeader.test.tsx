import React from 'react';

import { Typography } from '@mui/material';

import { render } from '../../../../test-utils';
import { Item } from '../../../../types';
import ItemsTable from '../../ItemsTable';
import ItemsTableHeader from '../ItemsTableHeader';
import ItemsTableHeaderCell from '../ItemsTableHeaderCell';

describe('ItemsTableHeaderCell', () => {
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

  const mockFn = jest.fn();

  it('render component', () => {
    const { container } = render(
      <ItemsTable>
        <ItemsTableHeader>
          <ItemsTableHeaderCell column={mockColumn} />
        </ItemsTableHeader>
      </ItemsTable>
    );
    expect(container).toHaveTextContent(/mock-column-label/);
  });
});
