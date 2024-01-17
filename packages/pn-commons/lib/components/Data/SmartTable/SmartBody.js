import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import checkChildren from '../../../utility/children.utility';
import SmartBodyRow from './SmartBodyRow';
const SmartBody = ({ children }) => {
    // check on children
    checkChildren(children, [{ cmp: SmartBodyRow }], 'SmartBody');
    return _jsx(_Fragment, { children: children });
};
export default SmartBody;
