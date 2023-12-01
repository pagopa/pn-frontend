import checkChildren from '../../../utility/children.utility';
import { PnTableBodyRowProps } from '../PnTable/PnTableBodyRow';
import SmartActions from './SmartActions';
import SmartBodyCell from './SmartBodyCell';

const SmartBodyRow: React.FC<PnTableBodyRowProps> = ({ children }) => {
  // check on children
  checkChildren(
    children,
    [{ cmp: SmartBodyCell }, { cmp: SmartActions, maxCount: 1 }],
    'SmartBodyRow'
  );

  return <>{children}</>;
};

export default SmartBodyRow;
