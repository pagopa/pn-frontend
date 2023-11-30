import { Children, ReactElement, isValidElement } from 'react';

import { TableRow } from '@mui/material';

import PnTableBodyCell from './PnTableBodyCell';

export type PnTableBodyRowProps = {
  testId?: string;
  index: number;
  children: ReactElement | Array<ReactElement>;
};

const PnTableBodyRow: React.FC<PnTableBodyRowProps> = ({ children, index, testId }) => {
  // check on children
  // PnTableBodyRow can have only children of type PnTableBodyCell
  // the cast ReactElement | Array<ReactElement> of property children ensures that the PnTableBodyRow can have only defined children (not null and not undefined)
  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }
    if (element.type !== PnTableBodyCell) {
      throw new Error('PnTableBodyRow must have only children of type PnTableBodyCell');
    }
  });

  return (
    <TableRow id={testId} data-testid={testId} role="row" aria-rowindex={index + 1}>
      {children}
    </TableRow>
  );
};

export default PnTableBodyRow;
