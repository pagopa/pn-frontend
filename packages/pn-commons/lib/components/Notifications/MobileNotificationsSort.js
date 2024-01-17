import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { Button, DialogActions, DialogContent, FormControlLabel, Radio, RadioGroup, } from '@mui/material';
import CustomMobileDialog from '../CustomMobileDialog/CustomMobileDialog';
import CustomMobileDialogAction from '../CustomMobileDialog/CustomMobileDialogAction';
import CustomMobileDialogContent from '../CustomMobileDialog/CustomMobileDialogContent';
import CustomMobileDialogToggle from '../CustomMobileDialog/CustomMobileDialogToggle';
const MobileNotificationsSort = ({ sortFields, sort, onChangeSorting, title, optionsTitle, cancelLabel, }) => {
    const [sortValue, setSortValue] = useState(sort ? `${sort.orderBy.toString()}-${sort.order}` : '');
    const prevSort = useRef(sortValue);
    const isSorted = sort.orderBy !== '';
    const handleChange = (event) => {
        const sortSelected = event.target.value;
        setSortValue(sortSelected);
    };
    const handleConfirmSort = () => {
        const sortField = sortFields.find((f) => f.id === sortValue);
        if (sortField && prevSort.current !== sortField.value) {
            onChangeSorting({ order: sortField.value, orderBy: sortField.field });
            /* eslint-disable-next-line functional/immutable-data */
            prevSort.current = sortField.value;
        }
    };
    const handleCancelSort = () => {
        setSortValue('');
        onChangeSorting({ order: 'asc', orderBy: '' });
    };
    return (_jsxs(CustomMobileDialog, { children: [_jsx(CustomMobileDialogToggle, { sx: { pr: isSorted ? '10px' : 0, height: '24px' }, hasCounterBadge: true, bagdeCount: isSorted ? 1 : 0, children: title }), _jsxs(CustomMobileDialogContent, { title: title, children: [_jsx(DialogContent, { children: _jsx(RadioGroup, { "aria-labelledby": optionsTitle, name: "radio-buttons-group", onChange: handleChange, value: sortValue, children: sortFields.map((f) => (_jsx(FormControlLabel, { value: f.id, control: _jsx(Radio, { "aria-label": f.label }), label: f.label }, f.id))) }) }), _jsxs(DialogActions, { children: [_jsx(CustomMobileDialogAction, { closeOnClick: true, children: _jsx(Button, { variant: "outlined", onClick: handleConfirmSort, children: title }) }), _jsx(CustomMobileDialogAction, { closeOnClick: true, children: _jsx(Button, { onClick: handleCancelSort, children: cancelLabel }) })] })] })] }));
};
export default MobileNotificationsSort;
