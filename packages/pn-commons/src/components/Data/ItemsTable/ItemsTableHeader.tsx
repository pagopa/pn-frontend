import React from 'react';

import { TableHead, TableRow } from '@mui/material';

import ItemsTableHeaderCell from './ItemsTableHeaderCell';

type Props = {
  testId?: string;
};

const ItemsTableHeader: React.FC<Props> = ({ testId, children }) => {
  const columns = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === ItemsTableHeaderCell
      )
    : [];
  return (
    <TableHead role="rowgroup" data-testid={testId}>
      <TableRow role="row">{columns}</TableRow>
    </TableHead>
  );
};

export default ItemsTableHeader;
