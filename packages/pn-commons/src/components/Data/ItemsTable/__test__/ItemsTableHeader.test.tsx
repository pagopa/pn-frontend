import React from 'react';

import { Typography } from '@mui/material';

import { render } from '../../../../test-utils';
import { Item } from '../../../../types';
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
      <table>
        <ItemsTableHeader>
          <ItemsTableHeaderCell
            key={mockColumn.id}
            testId="notificationsTable"
            columnId={mockColumn.id}
            sortable={mockColumn.sortable}
          >
            {mockColumn.label}
          </ItemsTableHeaderCell>
        </ItemsTableHeader>
      </table>
    );
    expect(container).toHaveTextContent(/mock-column-label/);
  });
});
