import { Children, ReactElement, isValidElement } from 'react';

import { TableHead, TableRow } from '@mui/material';

import PnTableHeaderCell from './PnTableHeaderCell';

export type PnTableHeaderProps = {
  testId?: string;
  children: ReactElement | Array<ReactElement>;
};

const PnTableHeader: React.FC<PnTableHeaderProps> = ({ testId, children }) => {
  // check on children
  // PnTableHeader can have only children of type PnTableHeaderCell
  // the cast ReactElement | Array<ReactElement> of property children ensures that the PnTableHeader can have only defined children (not null and not undefined)
  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }
    if (element.type !== PnTableHeaderCell) {
      throw new Error('PnTableHeader must have only children of type PnTableHeaderCell');
    }
  });

  return (
    <TableHead role="rowgroup" data-testid={testId}>
      <TableRow role="row">{children}</TableRow>
    </TableHead>
  );
};

export default PnTableHeader;
