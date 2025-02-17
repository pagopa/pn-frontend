import { vi } from 'vitest';

import { disableConsoleLogging, fireEvent, render, within } from '../../../../test-utils';
import PnTableBodyCell from '../PnTableBodyCell';

describe('PnTableBodyCell', () => {
  disableConsoleLogging('error');
  const mockFn = vi.fn();

  it('render component', () => {
    const { container, queryByTestId } = render(
      <PnTableBodyCell>mocked-cell-content</PnTableBodyCell>
    );
    expect(container).toHaveTextContent(/mocked-cell-content/);
    const buttons = queryByTestId('cell.button');
    expect(buttons).not.toBeInTheDocument();
  });

  it('click cell event', () => {
    const { getByTestId } = render(
      <PnTableBodyCell testId="cell" onClick={() => mockFn()}>
        mocked-cell-content
      </PnTableBodyCell>
    );
    const cell = getByTestId('cell');
    const button = within(cell).getByRole('button');
    fireEvent.click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
