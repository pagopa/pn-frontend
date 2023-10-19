import React from 'react';

import { TableRow } from '@mui/material';

import PnTableBodyCell, { IPnTableBodyCellProps } from './PnTableBodyCell';

export interface IPnTableBodyRowProps {
  testId?: string;
  index: number;
  children?:
    | Array<React.ReactElement<IPnTableBodyCellProps>>
    | React.ReactElement<IPnTableBodyCellProps>;
}
const PnTableBodyRow: React.FC<IPnTableBodyRowProps> = ({ children, index, testId }) => {
  const columns = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnTableBodyCell)
        .map((child: any) =>
          React.cloneElement(child, { ...child.props, testId: `${testId}.cell` })
        )
    : [];
  return (
    <TableRow id={testId} data-testid={testId} role="row" aria-rowindex={index + 1}>
      {columns}
    </TableRow>
  );
};

export default PnTableBodyRow;
