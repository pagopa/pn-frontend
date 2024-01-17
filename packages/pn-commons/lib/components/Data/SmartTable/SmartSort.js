import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { Button, DialogActions, DialogContent, FormControlLabel, Radio, RadioGroup, } from '@mui/material';
import CustomMobileDialog from '../../CustomMobileDialog/CustomMobileDialog';
import CustomMobileDialogAction from '../../CustomMobileDialog/CustomMobileDialogAction';
import CustomMobileDialogContent from '../../CustomMobileDialog/CustomMobileDialogContent';
import CustomMobileDialogToggle from '../../CustomMobileDialog/CustomMobileDialogToggle';
const SmartSort = ({ title, optionsTitle, cancelLabel, ascLabel, dscLabel, sort, sortFields, onChangeSorting, }) => {
    const [sortValue, setSortValue] = useState(sort.orderBy ? `${sort.orderBy.toString()}-${sort.order}` : '');
    const prevSort = useRef(sortValue);
    const isSorted = sortValue !== '';
    const fields = sortFields.reduce((arr, item) => {
        /* eslint-disable functional/immutable-data */
        arr.push({
            id: `${item.id.toString()}-asc`,
            label: `${item.label} ${ascLabel}`,
            field: item.id,
            value: 'asc',
        }, {
            id: `${item.id.toString()}-desc`,
            label: `${item.label} ${dscLabel}`,
            field: item.id,
            value: 'desc',
        });
        /* eslint-enable functional/immutable-data */
        return arr;
    }, []);
    const handleChange = (event) => {
        const sortSelected = event.target.value;
        setSortValue(sortSelected);
    };
    const handleConfirmSort = () => {
        const sortField = fields.find((f) => f.id === sortValue);
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
    return (_jsxs(CustomMobileDialog, { children: [_jsx(CustomMobileDialogToggle, { sx: { pr: isSorted ? '10px' : 0, height: '24px' }, hasCounterBadge: true, bagdeCount: isSorted ? 1 : 0, children: title }), _jsxs(CustomMobileDialogContent, { title: title, children: [_jsx(DialogContent, { children: _jsx(RadioGroup, { "aria-labelledby": optionsTitle, name: "radio-buttons-group", onChange: handleChange, value: sortValue, children: fields.map((f) => (_jsx(FormControlLabel, { value: f.id, control: _jsx(Radio, { "aria-label": f.label }), label: f.label }, f.id))) }) }), _jsxs(DialogActions, { children: [_jsx(CustomMobileDialogAction, { closeOnClick: true, children: _jsx(Button, { id: "confirm-button", variant: "outlined", onClick: handleConfirmSort, "data-testid": "confirmButton", disabled: !isSorted, children: title }) }), _jsx(CustomMobileDialogAction, { closeOnClick: true, children: _jsx(Button, { onClick: handleCancelSort, "data-testid": "cancelButton", children: cancelLabel }) })] })] })] }));
};
export default SmartSort;
