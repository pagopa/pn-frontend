import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import checkChildren from '../../../utility/children.utility';
import SmartActions from './SmartActions';
import SmartBodyCell from './SmartBodyCell';
const SmartBodyRow = ({ children }) => {
    // check on children
    checkChildren(children, [{ cmp: SmartBodyCell }, { cmp: SmartActions, maxCount: 1 }], 'SmartBodyRow');
    return _jsx(_Fragment, { children: children });
};
export default SmartBodyRow;
