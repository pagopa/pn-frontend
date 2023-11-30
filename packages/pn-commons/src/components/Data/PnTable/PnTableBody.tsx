import { Children, ReactElement, isValidElement } from 'react';

import { TableBody } from '@mui/material';

import PnTableBodyRow from './PnTableBodyRow';

export type PnTableBodyProps = {
  testId?: string;
  children: ReactElement | Array<ReactElement>;
};

const PnTableBody: React.FC<PnTableBodyProps> = ({ testId, children }) => {
  // check on children
  // PnTableBody can have only children of type PnTableBodyRow
  // the cast ReactElement | Array<ReactElement> of property children ensures that the PnTableBody can have only defined children (not null and not undefined)
  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }
    if (element.type !== PnTableBodyRow) {
      throw new Error('PnTableBody must have only children of type PnTableBodyRow');
    }
  });

  return (
    <TableBody sx={{ backgroundColor: 'background.paper' }} role="rowgroup" data-testid={testId}>
      {children}
    </TableBody>
  );
};

export default PnTableBody;
