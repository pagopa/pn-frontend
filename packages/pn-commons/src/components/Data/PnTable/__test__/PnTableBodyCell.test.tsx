import { disableConsoleLogging, render } from '../../../../test-utils';
import PnTableBodyCell from '../PnTableBodyCell';

describe('PnTableBodyCell', () => {
  disableConsoleLogging('error');

  it('render component', () => {
    const { container, queryByTestId } = render(
      <PnTableBodyCell>mocke-cell-content</PnTableBodyCell>
    );
    expect(container).toHaveTextContent(/mocke-cell-content/);
    const buttons = queryByTestId('cell.button');
    expect(buttons).not.toBeInTheDocument();
  });
});
