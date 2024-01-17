import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { Button, Grid, Menu, MenuItem, Pagination, PaginationItem } from '@mui/material';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
const getA11yPaginationLabels = (type, page, selected) => {
    // eslint-disable-next-line functional/no-let
    let ariaStr;
    switch (type) {
        case 'first':
            ariaStr = getLocalizedOrDefaultLabel('common', 'paginator.first', 'primo elemento');
            break;
        case 'last':
            ariaStr = getLocalizedOrDefaultLabel('common', 'paginator.last', 'ultimo elemento');
            break;
        case 'page':
            ariaStr = `${getLocalizedOrDefaultLabel('common', 'paginator.page', 'pagina')} ${page.toString()}`;
            break;
        case 'next':
            ariaStr = getLocalizedOrDefaultLabel('common', 'paginator.next', 'Vai alla pagina successiva');
            break;
        case 'previous':
            ariaStr = getLocalizedOrDefaultLabel('common', 'paginator.previous', 'Vai alla pagina precedente');
            break;
    }
    if (selected) {
        ariaStr += `, ${getLocalizedOrDefaultLabel('common', 'paginator.selected', 'elemento selezionato')}`;
    }
    return ariaStr;
};
/** Selfcare custom table available pages component */
export default function CustomPagination({ paginationData, onPageRequest, elementsPerPage = [10, 20, 50], pagesToShow, sx, eventTrackingCallbackPageSize, hideSizeSelector = false, }) {
    const size = paginationData.size || elementsPerPage[0];
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleChangeElementsPerPage = (selectedSize) => {
        if (size !== selectedSize) {
            // eslint-disable-next-line functional/immutable-data
            paginationData.size = selectedSize;
            // reset current page
            // eslint-disable-next-line functional/immutable-data
            paginationData.page = 0;
            onPageRequest(paginationData);
            if (eventTrackingCallbackPageSize) {
                eventTrackingCallbackPageSize(selectedSize);
            }
        }
        handleClose();
    };
    return (_jsxs(Grid, { container: true, sx: sx, "data-testid": "customPagination", children: [!hideSizeSelector && (_jsxs(Grid, { item: true, xs: 4, display: "flex", justifyContent: "start", alignItems: 'center', "data-testid": "itemsPerPageSelector", className: "items-per-page-selector", children: [_jsx(Button, { sx: { color: 'text.primary', fontWeight: 400 }, "aria-controls": open ? 'basic-menu' : undefined, "aria-haspopup": "true", "aria-expanded": open ? 'true' : undefined, onClick: handleClick, endIcon: _jsx(ArrowDropDown, {}), "aria-label": getLocalizedOrDefaultLabel('common', 'paginator.rows-per-page', 'Righe per pagina'), id: "rows-per-page", children: size }), _jsx(Menu, { id: "basic-menu", anchorEl: anchorEl, open: open, onClose: handleClose, MenuListProps: {
                            'aria-labelledby': getLocalizedOrDefaultLabel('common', 'paginator.rows-per-page', 'Righe per pagina'),
                        }, "data-testid": "", children: elementsPerPage.map((ep) => (_jsx(MenuItem, { id: `pageSize-${ep}`, "data-testid": `pageSize-${ep}`, onClick: () => handleChangeElementsPerPage(ep), children: ep }, ep))) })] })), _jsx(Grid, { item: true, xs: hideSizeSelector ? 12 : 8, display: "flex", justifyContent: "end", alignItems: 'center', "data-testid": "pageSelector", className: "page-selector", children: paginationData.totalElements > size && (_jsx(Pagination, { sx: { display: 'flex' }, "aria-label": getLocalizedOrDefaultLabel('common', 'paginator.aria-label', 'Menu Paginazione'), color: "primary", variant: "text", shape: "circular", page: paginationData.page + 1, count: Math.ceil(paginationData.totalElements / size), getItemAriaLabel: getA11yPaginationLabels, renderItem: (props2) => {
                        if (pagesToShow &&
                            props2.type === 'page' &&
                            props2.page !== null &&
                            pagesToShow.indexOf(props2.page) === -1) {
                            return null;
                        }
                        return (_jsx(PaginationItem, { id: props2.type === 'page' && props2.page
                                ? props2.type.concat(props2.page.toString())
                                : props2.type, ...props2, sx: { border: 'none' } }));
                    }, onChange: (_event, value) => onPageRequest({
                        ...paginationData,
                        page: value - 1,
                    }) })) })] }));
}
