import { TableCell, TableRow } from '@mui/material';

type Props = {
  label: string;
  value?: string | number;
  dataTestId?: string;
};

const CustomTableRow = ({ label, value, dataTestId }: Props) => (
  <TableRow sx={{
    paddingBottom: { xs: 2 },
    '& td': { border: 'none' },
    verticalAlign: 'top',
    display: { xs: 'flex', lg: 'table-row' },
    flexDirection: { xs: 'column', lg: 'row' },
  }} data-testid={dataTestId}>
    <TableCell padding="none" sx={{ py: { lg: 1 } }} data-testid="label">
      {label}
    </TableCell>
    <TableCell padding="none" sx={{ py: { lg: 1 } }} data-testid="value">
      <b>{value ?? '-'}</b>
    </TableCell>
  </TableRow>
);

export default CustomTableRow;
