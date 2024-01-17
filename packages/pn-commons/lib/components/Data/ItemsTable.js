import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, } from '@mui/material';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { ButtonNaked } from '@pagopa/mui-italia';
import { buttonNakedInheritStyle } from '../../utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
function ItemsTable({ columns, rows, sort, onChangeSorting, ariaTitle, testId = 'table(notifications)', }) {
    const sortHandler = (property) => () => {
        if (sort && onChangeSorting) {
            const isAsc = sort.orderBy === property && sort.order === 'asc';
            onChangeSorting({ order: isAsc ? 'desc' : 'asc', orderBy: property });
        }
    };
    // Table style
    const Root = styled('div')(() => `
    tr:first-of-type td:first-of-type {
      border-top-left-radius: 4px;
    }
    tr:first-of-type td:last-of-type {
      border-top-right-radius: 4px;
    }
    tr:last-of-type td:first-of-type {
      border-bottom-left-radius: 4px;
    }
    tr:last-of-type td:last-of-type {
      border-bottom-right-radius: 4px;
    }
    `);
    // TODO: gestire colore grigio di sfondo con variabile tema
    return (_jsx(Root, { children: _jsx(TableContainer, { sx: { marginBottom: '10px' }, children: _jsxs(Table, { id: "notifications-table", stickyHeader: true, "aria-label": ariaTitle ?? getLocalizedOrDefaultLabel('common', 'table.aria-label', 'Tabella di item'), "data-testid": testId, children: [_jsx(TableHead, { role: "rowgroup", "data-testid": "tableHead", children: _jsx(TableRow, { role: "row", children: columns.map((column) => (_jsx(TableCell, { scope: "col", "data-testid": "tableHeadCell", align: column.align, sx: {
                                    width: column.width,
                                    borderBottom: 'none',
                                    fontWeight: 600,
                                }, sortDirection: sort && sort.orderBy === column.id ? sort.order : false, children: sort && column.sortable ? (_jsxs(TableSortLabel, { active: sort.orderBy === column.id, direction: sort.orderBy === column.id ? sort.order : 'asc', onClick: sortHandler(column.id), "data-testid": `${testId}.sort.${column.id}`, children: [column.label, sort.orderBy === column.id && (_jsx(Box, { component: "span", sx: visuallyHidden, children: sort.order === 'desc' ? 'sorted descending' : 'sorted ascending' }))] })) : (column.label) }, column.id))) }) }), _jsx(TableBody, { sx: { backgroundColor: 'background.paper' }, role: "rowgroup", "data-testid": "tableBody", children: rows.map((row, index) => (_jsx(TableRow, { id: `${testId}.row`, "data-testid": `${testId}.row`, role: "row", "aria-rowindex": index + 1, children: columns.map((column) => {
                                const cellValue = column.getCellLabel(row[column.id], row);
                                return (_jsxs(TableCell, { role: "cell", "data-testid": "tableBodyCell", sx: {
                                        width: column.width,
                                        borderBottom: 'none',
                                        cursor: column.onClick ? 'pointer' : 'auto',
                                    }, align: column.align, onClick: () => column.onClick && column.onClick(row, column), children: [column.onClick && (_jsx(_Fragment, { children: _jsx(ButtonNaked, { id: `tableItem-${column.id}-${row.id}`, tabIndex: column.disableAccessibility ? -1 : 0, sx: buttonNakedInheritStyle, children: cellValue }) })), !column.onClick && (_jsx(Box, { id: `tableItem-${column.id}-${row.id}`, tabIndex: column.disableAccessibility ? -1 : 0, children: cellValue }))] }, column.id));
                            }) }, row.id))) })] }) }) }));
}
export default ItemsTable;
