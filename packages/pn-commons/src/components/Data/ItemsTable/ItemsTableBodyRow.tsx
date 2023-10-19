import React from 'react';

import { TableRow } from '@mui/material';

import ItemsTableBodyCell, { IItemsTableBodyCellProps } from './ItemsTableBodyCell';

export interface IItemsTableBodyRowProps {
  testId?: string;
  index: number;
  children?:
    | Array<React.ReactElement<IItemsTableBodyCellProps>>
    | React.ReactElement<IItemsTableBodyCellProps>;
}
const ItemsTableBodyRow: React.FC<IItemsTableBodyRowProps> = ({ children, index, testId }) => {
  const columns = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === ItemsTableBodyCell)
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

export default ItemsTableBodyRow;
