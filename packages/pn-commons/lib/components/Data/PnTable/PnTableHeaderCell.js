import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, TableCell, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
const PnTableHeaderCell = ({ testId, sort, cellProps, handleClick, sortable, columnId, children, }) => {
    const sortHandler = (property) => () => {
        if (sort && handleClick) {
            const isAsc = sort.orderBy === property && sort.order === 'asc';
            handleClick({ order: isAsc ? 'desc' : 'asc', orderBy: property });
        }
    };
    return (_jsx(TableCell, { ...cellProps, scope: "col", "data-testid": testId, sx: {
            ...cellProps?.sx,
            borderBottom: 'none',
            fontWeight: 600,
        }, sortDirection: sort && sort.orderBy === columnId ? sort.order : false, children: sort && sortable ? (_jsxs(TableSortLabel, { active: sort.orderBy === columnId, direction: sort.orderBy === columnId ? sort.order : 'asc', onClick: sortHandler(columnId), "data-testid": testId ? `${testId}.sort.${columnId.toString()}` : null, children: [children, sort.orderBy === columnId && (_jsx(Box, { component: "span", sx: visuallyHidden, children: sort.order === 'desc' ? 'sorted descending' : 'sorted ascending' }))] })) : (children) }));
};
export default PnTableHeaderCell;
