import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import _ from 'lodash';
import { useRef } from 'react';
import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useIsMobile } from '../../hooks';
import { filtersApplied } from '../../utility';
import CustomMobileDialog from '../CustomMobileDialog/CustomMobileDialog';
import CustomMobileDialogAction from '../CustomMobileDialog/CustomMobileDialogAction';
import CustomMobileDialogContent from '../CustomMobileDialog/CustomMobileDialogContent';
import CustomMobileDialogToggle from '../CustomMobileDialog/CustomMobileDialogToggle';
const useStyles = makeStyles({
    helperTextFormat: {
        // Use existing space / prevents shifting content below field
        alignItems: 'flex',
    },
});
/**
 * SmartFilter show filter in desktop view and dialog in mobile view.
 */
const SmartFilter = ({ filterLabel, cancelLabel, onSubmit, onClear, children, formIsValid, formValues, initialValues, }) => {
    const isMobile = useIsMobile();
    const classes = useStyles();
    const currentFilters = useRef(formValues);
    const isPreviousSearch = _.isEqual(formValues, currentFilters.current);
    const filtersCount = filtersApplied(currentFilters.current, initialValues);
    const submitHandler = (e) => {
        // eslint-disable-next-line functional/immutable-data
        currentFilters.current = formValues;
        onSubmit(e);
    };
    const clearHandler = () => {
        // eslint-disable-next-line functional/immutable-data
        currentFilters.current = initialValues;
        onClear();
    };
    const confirmAction = (_jsx(Button, { id: "confirm-button", "data-testid": "confirmButton", variant: "outlined", type: "submit", size: "small", disabled: !formIsValid || isPreviousSearch, children: filterLabel }));
    const cancelAction = (_jsx(Button, { "data-testid": "cancelButton", size: "small", onClick: clearHandler, disabled: !filtersCount, children: cancelLabel }));
    if (isMobile) {
        return (_jsxs(CustomMobileDialog, { children: [_jsx(CustomMobileDialogToggle, { sx: {
                        pl: 0,
                        pr: filtersCount ? '10px' : 0,
                        justifyContent: 'left',
                        minWidth: 'unset',
                        height: '24px',
                    }, hasCounterBadge: true, bagdeCount: filtersCount, children: filterLabel }), _jsx(CustomMobileDialogContent, { title: filterLabel, children: _jsxs("form", { onSubmit: submitHandler, children: [_jsx(DialogContent, { children: children }), _jsxs(DialogActions, { children: [_jsx(CustomMobileDialogAction, { children: confirmAction }), _jsx(CustomMobileDialogAction, { children: cancelAction })] })] }) })] }));
    }
    return (_jsx("form", { onSubmit: submitHandler, children: _jsx(Box, { sx: { flexGrow: 1, mt: 3 }, children: _jsxs(Grid, { container: true, spacing: 1, className: classes.helperTextFormat, alignItems: "center", children: [children, _jsx(Grid, { item: true, lg: "auto", xs: 12, children: confirmAction }), _jsx(Grid, { item: true, lg: "auto", xs: 12, children: cancelAction })] }) }) }));
};
export default SmartFilter;
