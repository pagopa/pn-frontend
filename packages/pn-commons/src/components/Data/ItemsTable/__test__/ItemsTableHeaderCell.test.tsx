import React from 'react';

import { Typography } from '@mui/material';

import { fireEvent, render } from '../../../../test-utils';
import { Item, Sort } from '../../../../types';
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
      <table>
        <thead>
          <tr>
            <ItemsTableHeaderCell column={mockColumn} />
          </tr>
        </thead>
      </table>
    );
    expect(container).toHaveTextContent(/mock-column-label/);
  });

  it('click cell event', () => {
    const { getByTestId } = render(
      <table>
        <thead>
          <tr>
            <ItemsTableHeaderCell
              sort={mockSort}
              testId="cell"
              column={mockColumn}
              handleClick={() => mockFn()}
            />
          </tr>
        </thead>
      </table>
    );

    const cell = getByTestId('cell.sort.name');

    fireEvent.click(cell);
    expect(mockFn).toBeCalledTimes(1);
  });
});
