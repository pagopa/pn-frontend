import { TableCell, TableRow } from '@mui/material';

type Props = {
  label: string;
  value?: string | number;
  dataTestId?: string;
};

const CustomTableRow = ({ label, value, dataTestId }: Props) => (
  <TableRow sx={{ '& td': { border: 'none' }, verticalAlign: 'top' }} data-testid={dataTestId}>
    <TableCell padding="none" sx={{ py: 1 }} data-testid="label">
      {label}
    </TableCell>
    <TableCell padding="none" sx={{ py: 1 }} data-testid="value">
      <b>{value ?? '-'}</b>
    </TableCell>
  </TableRow>
);

export default CustomTableRow;
