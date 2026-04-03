import { Box } from '@mui/material';

import { disableConsoleLogging, render } from '../../../../test-utils';
import PnTableHeader from '../PnTableHeader';
import PnTableHeaderCell from '../PnTableHeaderCell';

describe('PnTableHeaderCell', () => {
  disableConsoleLogging('error');

  it('render component', () => {
    const { container } = render(
      <PnTableHeader>
        <PnTableHeaderCell columnId={'mock-column-id'}>mock-column-label</PnTableHeaderCell>
      </PnTableHeader>
    );
    expect(container).toHaveTextContent(/mock-column-label/);
  });

  it('render component - incorrect child', () => {
    const { getByText } = render(
      <PnTableHeader>
        <PnTableHeaderCell columnId={'mock-column-id'}>mock-column-label</PnTableHeaderCell>
        <Box>Incorrect child</Box>
      </PnTableHeader>
    );
    expect(
      getByText('PnTableHeader can have only children of type PnTableHeaderCell')
    ).toBeInTheDocument();
  });
});
