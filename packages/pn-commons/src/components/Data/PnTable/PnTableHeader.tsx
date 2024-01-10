import { TableHead, TableRow } from '@mui/material';

import checkChildren from '../../../utility/children.utility';
import PnTableHeaderCell from './PnTableHeaderCell';

export type PnTableHeaderProps = {
  testId?: string;
  children: React.ReactNode;
};

const PnTableHeader: React.FC<PnTableHeaderProps> = ({ testId, children }) => {
  // check on children
  checkChildren(children, [{ cmp: PnTableHeaderCell }], 'PnTableHeader');

  return (
    <TableHead role="rowgroup" data-testid={testId}>
      <TableRow role="row">{children}</TableRow>
    </TableHead>
  );
};

export default PnTableHeader;
