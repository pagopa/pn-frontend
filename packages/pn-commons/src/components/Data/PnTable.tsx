import { Children, cloneElement, isValidElement } from 'react';

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
  children: React.ReactNode;
};

const PnTable: React.FC<Props> = ({ ariaTitle, testId = 'table', children }) => {
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

  const header = children
    ? Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnTableHeader)
        .map((child) =>
          isValidElement(child)
            ? cloneElement(child, { ...child.props, testId: `${testId}.header` })
            : child
        )
    : [];

  const body = children
    ? Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnTableBody)
        .map((child) =>
          isValidElement(child)
            ? cloneElement(child, { ...child.props, testId: `${testId}.body` })
            : child
        )
    : [];

  if (header.length === 0 && body.length === 0) {
    throw new Error('PnTable must have at least one child');
  }

  if (header.length === 0) {
    throw new Error('PnTable must have one child of type PnTableHeader');
  }

  if (body.length === 0) {
    throw new Error('PnTable must have one child of type PnTableBody');
  }

  if (body.length + header.length < Children.toArray(children).length) {
    throw new Error('PnTable must have only children of type PnTableHeader and PnTableBody');
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
          {header}
          {body}
        </Table>
      </TableContainer>
    </Root>
  );
};

export default PnTable;
