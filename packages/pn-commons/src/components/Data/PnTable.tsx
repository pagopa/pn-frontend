import { Children, ReactElement, isValidElement } from 'react';

import { Table, TableContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import PnTableBody from './PnTable/PnTableBody';
import PnTableHeader from './PnTable/PnTableHeader';

type Props = {
  /** Table title used in aria-label */
  ariaTitle?: string;
  /** Table test id */
  testId?: string;
  /** Table children (body and header) */
  children: [ReactElement, ReactElement];
};

const PnTable: React.FC<Props> = ({ ariaTitle, testId, children }) => {
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

  // eslint-disable-next-line functional/no-let
  let header = 0;

  // check on children
  // PnTable can have only one child of type PnTableHeader and only one child of type PnTableBody
  // the cast [ReactElement, ReactElement] of property children ensures that the PnTable can have two defined children (not null and not undefined)
  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }
    if (element.type !== PnTableHeader && element.type !== PnTableBody) {
      throw new Error(
        'PnTable must have one child of type PnTableHeader and one child of type PnTableBody'
      );
    }
    if (element.type === PnTableHeader) {
      header++;
    }
  });

  if (header === 0 || header > 1) {
    throw new Error('PnTable must have one child of type PnTableHeader');
  }

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
