import { jsx as _jsx } from "react/jsx-runtime";
import { CustomMobileDialogProvider } from './CustomMobileDialog.context';
/**
 * Container for mobile version of the dialog
 */
const CustomMobileDialog = ({ children }) => (_jsx(CustomMobileDialogProvider, { children: children }));
export default CustomMobileDialog;
