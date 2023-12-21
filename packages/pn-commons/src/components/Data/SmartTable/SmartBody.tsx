import checkChildren from '../../../utility/children.utility';
import { PnTableBodyProps } from '../PnTable/PnTableBody';
import SmartBodyRow from './SmartBodyRow';

const SmartBody: React.FC<PnTableBodyProps> = ({ children }) => {
  // check on children
  checkChildren(children, [{ cmp: SmartBodyRow }], 'SmartBody');

  return <>{children}</>;
};

export default SmartBody;
