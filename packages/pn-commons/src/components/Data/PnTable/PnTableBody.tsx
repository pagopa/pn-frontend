import React from 'react';

import { TableBody } from '@mui/material';

import PnTableBodyRow, { IPnTableBodyRowProps } from './PnTableBodyRow';

export interface IPnTableBodyProps {
  testId?: string;
  children:
    | Array<React.ReactElement<IPnTableBodyRowProps>>
    | React.ReactElement<IPnTableBodyRowProps>;
}

const PnTableBody: React.FC<IPnTableBodyProps> = ({ testId, children }) => {
  const rows = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnTableBodyRow)
        .map((child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { ...child.props, testId: `${testId}.row` })
            : child
        )
    : [];
  return (
    <TableBody sx={{ backgroundColor: 'background.paper' }} role="rowgroup" data-testid={testId}>
      {rows}
    </TableBody>
  );
};

export default PnTableBody;
