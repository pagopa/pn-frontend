import React from 'react';

import { fireEvent, render } from '../../../../test-utils';
import PnTableBodyCell from '../PnTableBodyCell';

describe('PnTableBodyCell', () => {
  const mockFn = jest.fn();

  it('render component', () => {
    const { container, queryByTestId } = render(
      <PnTableBodyCell>mocke-cell-content</PnTableBodyCell>
    );
    expect(container).toHaveTextContent(/mocke-cell-content/);
    const buttons = queryByTestId('cell.button');
    expect(buttons).not.toBeInTheDocument();
  });

  it('click cell event', () => {
    const { getByTestId } = render(
      <PnTableBodyCell onClick={() => mockFn()}>mocke-cell-content</PnTableBodyCell>
    );
    const cell = getByTestId('cell.button');
    fireEvent.click(cell);
    expect(mockFn).toBeCalledTimes(1);
  });
});
