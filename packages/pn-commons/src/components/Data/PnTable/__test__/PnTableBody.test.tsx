import { Box } from '@mui/material';

import { disableConsoleLogging, render } from '../../../../test-utils';
import PnTableBody from '../PnTableBody';
import PnTableBodyCell from '../PnTableBodyCell';
import PnTableBodyRow from '../PnTableBodyRow';

describe('PnTableBody', () => {
  disableConsoleLogging('error');

  it('render component', () => {
    const { container } = render(
      <PnTableBody>
        <PnTableBodyRow index={1}>
          <PnTableBodyCell>mocked-cell-content</PnTableBodyCell>
        </PnTableBodyRow>
      </PnTableBody>
    );
    expect(container).toHaveTextContent(/mocked-cell-content/);
  });

  it('render component - incorrect child', () => {
    expect(() =>
      render(
        <PnTableBody>
          <PnTableBodyRow index={1}>
            <PnTableBodyCell>mocked-cell-content</PnTableBodyCell>
          </PnTableBodyRow>
          <Box>Incorrect child</Box>
        </PnTableBody>
      )
    ).toThrowError('PnTableBody can have only children of type PnTableBodyRow');
  });
});
