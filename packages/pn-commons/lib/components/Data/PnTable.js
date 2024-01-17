import { jsx as _jsx } from "react/jsx-runtime";
import { Table, TableContainer } from '@mui/material';
import { styled } from '@mui/material/styles';
import checkChildren from '../../utility/children.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import PnTableBody from './PnTable/PnTableBody';
import PnTableHeader from './PnTable/PnTableHeader';
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
const PnTable = ({ ariaTitle, testId, children }) => {
    // check on children
    checkChildren(children, [
        { cmp: PnTableHeader, maxCount: 1, required: true },
        { cmp: PnTableBody, maxCount: 1, required: true },
    ], 'PnTable');
    return (_jsx(Root, { children: _jsx(TableContainer, { sx: { marginBottom: '10px' }, children: _jsx(Table, { id: "notifications-table", stickyHeader: true, "aria-label": ariaTitle ?? getLocalizedOrDefaultLabel('common', 'table.aria-label'), "data-testid": testId, children: children }) }) }));
};
export default PnTable;
