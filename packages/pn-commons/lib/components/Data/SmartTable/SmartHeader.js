import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import checkChildren from '../../../utility/children.utility';
import SmartHeaderCell from './SmartHeaderCell';
const SmartHeader = ({ children }) => {
    // check on children
    checkChildren(children, [{ cmp: SmartHeaderCell }], 'SmartHeader');
    return _jsx(_Fragment, { children: children });
};
export default SmartHeader;
