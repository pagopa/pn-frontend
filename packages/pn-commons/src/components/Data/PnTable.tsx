import { Table, TableContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

import checkChildren from '../../utility/children.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import PnTableBody from './PnTable/PnTableBody';
import PnTableHeader from './PnTable/PnTableHeader';

type Props = {
  /** Table title used in aria-label */
  ariaTitle?: string;
  /** Table test id */
  testId?: string;
  /** Table children (body and header) */
  children: React.ReactNode;
};

// Table style
const Root = styled('div')(
  () => `
  tr:first-of-type td:first-of-type {
    border-top-left-radius: 4px;
  }
  tr:first-of-type td:last-of-type {
    border-top-right-radius: 4px;
  }
  tr:last-of-type td:first-of-type {
    border-bottom-left-radius: 4px;
  }
  tr:last-of-type td:last-of-type {
    border-bottom-right-radius: 4px;
  }
  `
);

const PnTable: React.FC<Props> = ({ ariaTitle, testId, children }) => {
  // check on children
  checkChildren(
    children,
    [
      { cmp: PnTableHeader, maxCount: 1, required: true },
      { cmp: PnTableBody, maxCount: 1, required: true },
    ],
    'PnTable'
  );

  return (
    <Root>
      <TableContainer sx={{ marginBottom: '10px' }}>
        <Table
          id="notifications-table"
          stickyHeader
          aria-label={ariaTitle ?? getLocalizedOrDefaultLabel('common', 'table.aria-label')}
          data-testid={testId}
        >
          {children}
        </Table>
      </TableContainer>
    </Root>
  );
};

export default PnTable;
