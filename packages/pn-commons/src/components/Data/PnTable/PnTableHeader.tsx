import React from 'react';

import { TableHead, TableRow } from '@mui/material';

import PnTableHeaderCell, { IPnTableHeaderCellProps } from './PnTableHeaderCell';

export interface IPnTableHeaderProps {
  testId?: string;
  children:
    | Array<React.ReactElement<IPnTableHeaderCellProps<string>>>
    | React.ReactElement<IPnTableHeaderCellProps<string>>;
}

const PnTableHeader: React.FC<IPnTableHeaderProps> = ({ testId, children }) => {
  const columns = children
    ? React.Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnTableHeaderCell)
        .map((child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { ...child.props, testId: `${testId}.cell` })
            : child
        )
    : [];
  return (
    <TableHead role="rowgroup" data-testid={testId}>
      <TableRow role="row">{columns}</TableRow>
    </TableHead>
  );
};

export default PnTableHeader;
