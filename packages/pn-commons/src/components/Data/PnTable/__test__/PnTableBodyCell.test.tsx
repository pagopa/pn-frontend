import React from 'react';

import { Typography } from '@mui/material';

import { fireEvent, render } from '../../../../test-utils';
import { Item } from '../../../../types';
import PnTableBodyCell from '../PnTableBodyCell';

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

  it('click cell event', () => {
    const { getByTestId } = render(
      <table>
        <tbody>
          <tr>
            <PnTableBodyCell onClick={() => mockColumn.onClick()}>
              {mockColumn.getCellLabel(mockRow[mockColumn.id as keyof Item], mockRow[0])}
            </PnTableBodyCell>
          </tr>
        </tbody>
      </table>
    );
    const cell = getByTestId('cell');
    fireEvent.click(cell);
    expect(mockFn).toBeCalledTimes(1);
  });
});
