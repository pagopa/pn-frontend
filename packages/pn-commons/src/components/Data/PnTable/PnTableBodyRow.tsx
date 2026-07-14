import { SxProps, TableRow, Theme } from '@mui/material';

import { checkChildren } from '../../../utility/children.utility';
import PnTableBodyCell from './PnTableBodyCell';

export type PnTableBodyRowProps = {
  testId?: string;
  index: number;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

const PnTableBodyRow: React.FC<PnTableBodyRowProps> = ({ children, index, testId, sx }) => {
  // check on children
  checkChildren(children, [{ cmp: PnTableBodyCell }], 'PnTableBodyRow');

  return (
    <TableRow id={testId} data-testid={testId} role="row" aria-rowindex={index + 1} sx={sx}>
      {children}
    </TableRow>
  );
};

export default PnTableBodyRow;
