import React from 'react';

import { Table, TableContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import ItemsTableBody from './ItemsTable/ItemsTableBody';
import ItemsTableHeader from './ItemsTable/ItemsTableHeader';

type Props = {
  /** Table title used in aria-label */
  ariaTitle?: string;
  /** Table test id */
  testId?: string;
};

const ItemsTable: React.FC<Props> = ({ ariaTitle, testId = 'table(notifications)', children }) => {
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

  // TODO: gestire colore grigio di sfondo con variabile tema
  const header = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === ItemsTableHeader
      )
    : [];

  const body = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === ItemsTableBody
      )
    : [];

  return (
    <Root>
      <TableContainer sx={{ marginBottom: '10px' }}>
        <Table
          id="notifications-table"
          stickyHeader
          aria-label={
            ariaTitle ?? getLocalizedOrDefaultLabel('common', 'table.aria-label', 'Tabella di item')
          }
          data-testid={testId}
        >
          {header}
          {body}
        </Table>
      </TableContainer>
    </Root>
  );
};

export default ItemsTable;
