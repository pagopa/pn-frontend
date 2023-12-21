import checkChildren from '../../../utility/children.utility';
import { PnTableHeaderProps } from '../PnTable/PnTableHeader';
import SmartHeaderCell from './SmartHeaderCell';

const SmartHeader: React.FC<PnTableHeaderProps> = ({ children }) => {
  // check on children
  checkChildren(children, [{ cmp: SmartHeaderCell }], 'SmartHeader');

  return <>{children}</>;
};

export default SmartHeader;
