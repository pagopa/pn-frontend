import React from 'react';
import { vi } from 'vitest';

import { disableConsoleLogging, fireEvent, render } from '../../../../test-utils';
import PnTableBodyCell from '../PnTableBodyCell';

describe('PnTableBodyCell', () => {
  disableConsoleLogging('error');

  const mockFn = vi.fn();

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
      <PnTableBodyCell testId="cell" onClick={() => mockFn()}>
        mocke-cell-content
      </PnTableBodyCell>
    );
    const cell = getByTestId('cell');
    fireEvent.click(cell);
    expect(mockFn).toBeCalledTimes(1);
  });
});
