import React from 'react';

import { Typography } from '@mui/material';

import { fireEvent, render } from '../../../../test-utils';
import { Item, Sort } from '../../../../types';
import ItemsTable from '../../ItemsTable';
import ItemsTableHeader from '../ItemsTableHeader';
import ItemsTableHeaderCell from '../ItemsTableHeaderCell';

describe('ItemsTableHeaderCell', () => {
  const mockColumn = {
    id: 'name',
    label: 'mock-column-label',
    width: '30%',
    sortable: true,
    getCellLabel(value: string, row: Item) {
      return <Typography>mock-column-value</Typography>;
    },
    onClick: () => mockFn(),
  };

  const mockSort: Sort<string> = {
    order: 'asc',
    orderBy: 'name',
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

  it('click cell event', () => {
    const { getByTestId } = render(
      <ItemsTable>
        <ItemsTableHeader>
          <ItemsTableHeaderCell
            sort={mockSort}
            testId="cell"
            column={mockColumn}
            handleClick={() => mockFn()}
          />
        </ItemsTableHeader>
      </ItemsTable>
    );

    const cell = getByTestId('cell.sort.name');

    fireEvent.click(cell);
    expect(mockFn).toBeCalledTimes(1);
  });
});
