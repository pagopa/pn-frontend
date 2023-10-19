import React from 'react';

import { TableHead, TableRow } from '@mui/material';

import ItemsTableHeaderCell, { IItemsTableHeaderCellProps } from './ItemsTableHeaderCell';

export interface IItemsTableHeaderProps {
  testId?: string;
  children?:
    | Array<React.ReactElement<IItemsTableHeaderCellProps<string>>>
    | React.ReactElement<IItemsTableHeaderCellProps<string>>;
}

const ItemsTableHeader: React.FC<IItemsTableHeaderProps> = ({ testId, children }) => {
  const columns = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === ItemsTableHeaderCell)
        .map((child: any) =>
          React.cloneElement(child, { ...child.props, testId: `${testId}.cell` })
        )
    : [];
  return (
    <TableHead role="rowgroup" data-testid={testId}>
      <TableRow role="row">{columns}</TableRow>
    </TableHead>
  );
};

export default ItemsTableHeader;
