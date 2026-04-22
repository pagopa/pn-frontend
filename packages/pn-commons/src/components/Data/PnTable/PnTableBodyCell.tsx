import { Children, FC, ReactNode } from 'react';

import { TableCell } from '@mui/material';

import { TableCellProps } from '../../../models/PnTable';
import { ValueMode } from '../../../models/SmartTable';
import { isExplicitChild } from '../../../utility/children.utility';
import DataValue from '../DataValue';

export type PnTableBodyCellProps = {
  testId?: string;
  mode?: ValueMode;
  cellProps?: TableCellProps;
  children: ReactNode;
};

const PnTableBodyCell: FC<PnTableBodyCellProps> = ({ testId, mode, cellProps, children }) => {
  const hasDataValue = Children.toArray(children).some((child) =>
    isExplicitChild(child, 'DataValue')
  );
  return (
    <TableCell
      scope="col"
      data-testid={testId}
      {...cellProps}
      sx={{
        borderBottom: 'none',
      }}
    >
      {hasDataValue && children}
      {!hasDataValue && <DataValue mode={mode}>{children}</DataValue>}
    </TableCell>
  );
};

export default PnTableBodyCell;
