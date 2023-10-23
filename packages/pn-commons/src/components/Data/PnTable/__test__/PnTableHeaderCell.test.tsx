import React from 'react';

import { Typography } from '@mui/material';

import { Item, Sort } from '../../../../models';
import { fireEvent, render } from '../../../../test-utils';
import PnTableHeaderCell from '../PnTableHeaderCell';

describe('PnTableHeaderCell', () => {
  const mockFn = jest.fn();

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

  it('render component', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <PnTableHeaderCell
              sort={mockSort}
              key={mockColumn.id}
              columnId={mockColumn.id}
              sortable={mockColumn.sortable}
            >
              {mockColumn.label}
            </PnTableHeaderCell>
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
            <PnTableHeaderCell
              key={mockColumn.id}
              sort={mockSort}
              columnId={mockColumn.id}
              sortable={mockColumn.sortable}
              handleClick={mockFn(mockSort.orderBy)}
            >
              {mockColumn.label}
            </PnTableHeaderCell>
          </tr>
        </thead>
      </table>
    );
    const cell = getByTestId('headerCell');

    fireEvent.click(cell);
    expect(mockFn).toBeCalledTimes(1);
  });
});
