import { PropsWithChildren } from 'react';

import { Box, TableCell, TableCellProps } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { Column, Item } from '../../../types';
import { buttonNakedInheritStyle } from '../../../utility';

type Props<ColumnId> = {
  testId?: string;
  cellProps?: TableCellProps;
  column: Column<ColumnId>;
  row: Item;
};

const ItemsTableBodyCell = <ColumnId extends string>({
  testId,
  cellProps,
  column,
  row,
}: PropsWithChildren<Props<ColumnId>>) => {
  const cellValue = column.getCellLabel(row[column.id as keyof Item], row);
  return (
    <TableCell
      role="cell"
      data-testid={testId}
      sx={{
        ...cellProps?.sx,
        width: column.width,
        align: column.align,
        borderBottom: 'none',
        cursor: column.onClick ? 'pointer' : 'auto',
      }}
      onClick={() => column.onClick && column.onClick(row, column)}
    >
      {column.onClick && (
        <>
          {/* Even there is a onClick function on the TableCell, leave ButtonNaked below as is.
            This makes spacebar key with accessibility to trigger the onClick function.
            The ButtonNaked "inherits" the onClick action from the outer TableCell, so that is not necessary to replicate it. */}
          <ButtonNaked tabIndex={column.disableAccessibility ? -1 : 0} sx={buttonNakedInheritStyle}>
            {cellValue}
          </ButtonNaked>
        </>
      )}
      {!column.onClick && <Box tabIndex={column.disableAccessibility ? -1 : 0}>{cellValue}</Box>}
    </TableCell>
  );
};

export default ItemsTableBodyCell;
