import { Box } from '@mui/material';

import { disableConsoleLogging, render } from '../../../../test-utils';
import PnTableBodyCell from '../PnTableBodyCell';
import PnTableBodyRow from '../PnTableBodyRow';

describe('PnTableBodyRow', () => {
  disableConsoleLogging('error');

  it('render component', () => {
    const { container } = render(
      <PnTableBodyRow index={1}>
        <PnTableBodyCell>mocked-cell-content</PnTableBodyCell>
      </PnTableBodyRow>
    );
    expect(container).toHaveTextContent(/mocked-cell-content/);
  });

  it('render component - incorrect child', () => {
    const { getByText } = render(
      <PnTableBodyRow index={1}>
        <PnTableBodyCell>mocked-cell-content</PnTableBodyCell>
        <Box>Incorrect child</Box>
      </PnTableBodyRow>
    );
    expect(
      getByText('PnTableBodyRow can have only children of type PnTableBodyCell')
    ).toBeInTheDocument();
  });
});
