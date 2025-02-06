import { Box, SxProps, TableCell } from '@mui/material';

export type PnTableBodyCellProps = {
  testId?: string;
  cellProps?: SxProps;
  children: React.ReactNode;
};

const PnTableBodyCell: React.FC<PnTableBodyCellProps> = ({ testId, cellProps, children }) => (
  <TableCell
    scope="col"
    data-testid={testId}
    sx={{
      ...cellProps!,
      borderBottom: 'none',
    }}
  >
    <Box>{children}</Box>
  </TableCell>
);
export default PnTableBodyCell;
