import React from 'react';

import { Typography } from '@mui/material';

import { Item, Sort } from '../../../../models';
import { fireEvent, queryByRole, queryByTestId, render } from '../../../../test-utils';
import PnTableHeaderCell from '../PnTableHeaderCell';

describe('PnTableHeaderCell', () => {
  const mockFn = jest.fn();

  const mockSort: Sort<string> = {
    order: 'asc',
    orderBy: 'name',
  };

  it('render component', () => {
    const { container, queryByTestId } = render(
      <table>
        <thead>
          <tr>
            <PnTableHeaderCell sort={mockSort} columnId={'mock-column-id'} sortable={false}>
              mock-column-label
            </PnTableHeaderCell>
          </tr>
        </thead>
      </table>
    );
    expect(container).toHaveTextContent(/mock-column-label/);
    const cell = queryByTestId('headerCell.sort.mock-column-id');
    expect(cell).not.toBeInTheDocument();
  });

  it('click cell event', () => {
    const { getByTestId } = render(
      <table>
        <thead>
          <tr>
            <PnTableHeaderCell
              sort={mockSort}
              columnId={'mock-column-id'}
              sortable={true}
              handleClick={mockFn(mockSort.orderBy)}
            >
              mock-column-label
            </PnTableHeaderCell>
          </tr>
        </thead>
      </table>
    );
    const cell = getByTestId('headerCell.sort.mock-column-id');

    fireEvent.click(cell);
    expect(mockFn).toBeCalledTimes(1);
  });
});
