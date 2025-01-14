import { TableBody } from '@mui/material';

import checkChildren from '../../../utility/children.utility';
import PnTableBodyRow from './PnTableBodyRow';

export type PnTableBodyProps = {
  testId?: string;
  children: React.ReactNode;
};

const PnTableBody: React.FC<PnTableBodyProps> = ({ testId, children }) => {
  // check on children
  checkChildren(children, [{ cmp: PnTableBodyRow }], 'PnTableBody');

  return (
    <TableBody sx={{ backgroundColor: 'background.paper' }} role="rowgroup" data-testid={testId}>
      {children}
    </TableBody>
  );
};

export default PnTableBody;
