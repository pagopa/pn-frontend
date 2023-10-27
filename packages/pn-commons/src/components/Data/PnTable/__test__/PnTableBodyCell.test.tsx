import React from 'react';

import { fireEvent, render } from '../../../../test-utils';
import PnTableBodyCell from '../PnTableBodyCell';

describe('PnTableBodyCell', () => {
  const mockFn = jest.fn();

  it('render component', () => {
    const { container, queryByTestId } = render(
      <table>
        <tbody>
          <tr>
            <PnTableBodyCell>mocke-cell-content</PnTableBodyCell>
          </tr>
        </tbody>
      </table>
    );
    expect(container).toHaveTextContent(/mocke-cell-content/);
    const buttons = queryByTestId('cell.button');
    expect(buttons).not.toBeInTheDocument();
  });

  it('click cell event', () => {
    const { getByTestId } = render(
      <table>
        <tbody>
          <tr>
            <PnTableBodyCell onClick={() => mockFn()}>mocke-cell-content</PnTableBodyCell>
          </tr>
        </tbody>
      </table>
    );
    const cell = getByTestId('cell.button');
    fireEvent.click(cell);
    expect(mockFn).toBeCalledTimes(1);
  });
});
