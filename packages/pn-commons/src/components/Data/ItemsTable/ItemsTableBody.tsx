import { TableBody } from '@mui/material';

type Props = {
  testId?: string;
};

const ItemsTableBody: React.FC<Props> = ({ testId, children }) => (
  <TableBody sx={{ backgroundColor: 'background.paper' }} role="rowgroup" data-testid={testId}>
    {children}
  </TableBody>
);

export default ItemsTableBody;
