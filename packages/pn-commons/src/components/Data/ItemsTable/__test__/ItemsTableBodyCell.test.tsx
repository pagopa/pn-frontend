import React from 'react';

import { Typography } from '@mui/material';

import { fireEvent, render } from '../../../../test-utils';
import { Item } from '../../../../types';
import ItemsTableBodyCell from '../ItemsTableBodyCell';

describe('ItemsTableBodyCell', () => {
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

  const mockRow: Item = {
    id: 'name',
  };

  const mockFn = jest.fn();

  it('render component', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <ItemsTableBodyCell column={mockColumn} row={mockRow} />
          </tr>
        </tbody>
      </table>
    );
    expect(container).toHaveTextContent(/mock-column-value/);
  });

  it('click cell event', () => {
    const { getByTestId } = render(
      <table>
        <tbody>
          <tr>
            <ItemsTableBodyCell testId="cell" column={mockColumn} row={mockRow} />
          </tr>
        </tbody>
      </table>
    );
    const cell = getByTestId('cell');
    fireEvent.click(cell);
    expect(mockFn).toBeCalledTimes(1);
  });
});
