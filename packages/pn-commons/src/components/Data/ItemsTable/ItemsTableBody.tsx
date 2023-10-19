import React from 'react';

import { TableBody } from '@mui/material';

import ItemsTableBodyRow, { IItemsTableBodyRowProps } from './ItemsTableBodyRow';

export interface IItemsTableBodyProps {
  testId?: string;
  children?:
    | Array<React.ReactElement<IItemsTableBodyRowProps>>
    | React.ReactElement<IItemsTableBodyRowProps>;
}

const ItemsTableBody: React.FC<IItemsTableBodyProps> = ({ testId, children }) => {
  const rows = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === ItemsTableBodyRow)
        .map((child: any) => React.cloneElement(child, { ...child.props, testId: `${testId}.row` }))
    : [];
  return (
    <TableBody sx={{ backgroundColor: 'background.paper' }} role="rowgroup" data-testid={testId}>
      {rows}
    </TableBody>
  );
};

export default ItemsTableBody;
