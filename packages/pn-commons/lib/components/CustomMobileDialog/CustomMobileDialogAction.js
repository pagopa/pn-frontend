import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from '@mui/material';
import { useCustomMobileDialogContext } from './CustomMobileDialog.context';
/**
 * Dialog actions
 * @param children the react component for the action
 * @param closeOnClick flag for close the dialog on action click
 */
const CustomMobileDialogAction = ({ children, closeOnClick = false }) => {
    const { toggleOpen } = useCustomMobileDialogContext();
    const handleActionClick = () => {
        if (closeOnClick) {
            toggleOpen();
        }
    };
    return (_jsx(Box, { "data-testid": "dialogAction", onClick: handleActionClick, children: children }));
};
export default CustomMobileDialogAction;
