import React from 'react';

import { TableRow } from '@mui/material';

import ItemsTableBodyCell from './ItemsTableBodyCell';

type Props = {
  testId?: string;
  index: number;
};
const ItemsTableBodyRow: React.FC<Props> = ({
  children,
  index,
  testId = 'table(notifications)',
}) => {
  const columns = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === ItemsTableBodyCell
      )
    : [];
  return (
    <TableRow
      id={`${testId}.row`}
      data-testid={`${testId}.row`}
      role="row"
      aria-rowindex={index + 1}
    >
      {columns}
    </TableRow>
  );
};

export default ItemsTableBodyRow;
