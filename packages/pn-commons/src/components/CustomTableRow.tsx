import { TableCell, TableRow } from "@mui/material";

type Props = {
  label: string;
  value: string | number | undefined;
};

const CustomTableRow = ({ label, value }: Props) => (
  <TableRow sx={{ '& td': { border: 'none' }, verticalAlign: 'top' }}>
    <TableCell
      padding="none"
      sx={{ py: 1 }}>
      {label}
    </TableCell>
    <TableCell padding="none" sx={{ py: 1 }}>
      {value ?? '-'}
    </TableCell>
  </TableRow>
);

export default CustomTableRow;