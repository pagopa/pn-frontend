import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Children } from 'react';
import { Box, Grid } from '@mui/material';
import { useIsMobile } from '../../hooks';
import { calculatePages } from '../../utility';
import checkChildren from '../../utility/children.utility';
import CustomPagination from '../Pagination/CustomPagination';
import SmartBody from './SmartTable/SmartBody';
import SmartData from './SmartTable/SmartData';
import SmartFilter from './SmartTable/SmartFilter';
import SmartHeader from './SmartTable/SmartHeader';
import SmartSort from './SmartTable/SmartSort';
function getSortFields(conf) {
    const sortFields = [];
    for (const cfg of conf) {
        if (cfg.tableConfiguration.sortable) {
            // eslint-disable-next-line functional/immutable-data
            sortFields.push({
                id: cfg.id,
                label: cfg.label,
            });
        }
    }
    return { sortFields };
}
/**
 * SmartTable show table in desktop view and cards in mobile view.
 */
const SmartTable = ({ children, conf, data, currentSort, sortLabels, onChangeSorting = () => { }, pagination, emptyState, testId, ariaTitle, }) => {
    const isMobile = useIsMobile();
    checkChildren(children, [
        { cmp: SmartFilter, maxCount: 1 },
        { cmp: SmartHeader, required: true, maxCount: 1 },
        { cmp: SmartBody, required: true, maxCount: 1 },
    ], 'SmartTable');
    const filters = children
        ? Children.toArray(children).find((child) => child.type === SmartFilter)
        : null;
    const pagesToShow = pagination
        ? calculatePages(pagination.size, pagination.totalElements, pagination.numOfDisplayedPages, pagination.currentPage + 1)
        : undefined;
    if (isMobile) {
        const { sortFields } = getSortFields(conf);
        return (_jsxs(_Fragment, { children: [_jsxs(Grid, { container: true, direction: "row", sx: { mb: 2 }, children: [_jsx(Grid, { item: true, xs: 6, children: filters }), _jsx(Grid, { item: true, xs: 6, textAlign: "right", children: currentSort && sortFields.length > 0 && sortLabels && (_jsx(SmartSort, { title: sortLabels.title, optionsTitle: sortLabels.optionsTitle, cancelLabel: sortLabels.cancel, ascLabel: sortLabels.asc, dscLabel: sortLabels.dsc, sortFields: sortFields, sort: currentSort, onChangeSorting: onChangeSorting })) })] }), data.length > 0 && (_jsx(SmartData, { ariaTitle: ariaTitle, testId: testId, sort: currentSort, onChangeSorting: onChangeSorting, children: children })), data.length > 0 && pagination && (_jsx(CustomPagination, { paginationData: {
                        size: pagination.size,
                        page: pagination.currentPage,
                        totalElements: pagination.totalElements,
                    }, onPageRequest: pagination.onChangePage, pagesToShow: pagesToShow, sx: isMobile
                        ? {
                            padding: '0',
                            '& .items-per-page-selector button': {
                                paddingLeft: 0,
                                height: '24px',
                            },
                        }
                        : { padding: '0' } })), data.length === 0 && emptyState] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(Box, { mb: 3, children: filters }), data.length > 0 && (_jsx(SmartData, { ariaTitle: ariaTitle, testId: testId, sort: currentSort, onChangeSorting: onChangeSorting, children: children })), data.length > 0 && pagination && (_jsx(CustomPagination, { paginationData: {
                    size: pagination.size,
                    page: pagination.currentPage,
                    totalElements: pagination.totalElements,
                }, onPageRequest: pagination.onChangePage, pagesToShow: pagesToShow, sx: isMobile
                    ? {
                        padding: '0',
                        '& .items-per-page-selector button': {
                            paddingLeft: 0,
                            height: '24px',
                        },
                    }
                    : { padding: '0' } })), data.length === 0 && emptyState] }));
};
export default SmartTable;
