import { TableRow } from '@mui/material';

import checkChildren from '../../../utility/children.utility';
import PnTableBodyCell from './PnTableBodyCell';

export type PnTableBodyRowProps = {
  testId?: string;
  index: number;
  children: React.ReactNode;
};

const PnTableBodyRow: React.FC<PnTableBodyRowProps> = ({ children, index, testId }) => {
  // check on children
  checkChildren(children, [{ cmp: PnTableBodyCell }], 'PnTableBodyRow');

  return (
    <TableRow id={testId} data-testid={testId} role="row" aria-rowindex={index + 1}>
      {children}
    </TableRow>
  );
};

export default PnTableBodyRow;
