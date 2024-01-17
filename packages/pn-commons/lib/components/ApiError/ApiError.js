import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Stack, Typography, styled } from '@mui/material';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
const StyledStack = styled(Stack) `
  border-radius: 4px;
  background-color: #ffffff;
  padding: 16px;
`;
const ApiError = ({ onClick, mt = 0, mainText, apiId }) => {
    const dataTestId = `api-error${apiId ? `-${apiId}` : ''}`;
    const text = mainText ||
        getLocalizedOrDefaultLabel('common', `messages.generic-api-error-main-text`, 'Non siamo riusciti a recuperare questi dati.');
    const actionLaunchText = getLocalizedOrDefaultLabel('common', `messages.generic-api-error-action-text`, 'Ricarica');
    return (_jsxs(StyledStack, { sx: { fontSize: '16px', mt }, direction: 'row', justifyContent: 'center', alignItems: 'center', "data-testid": dataTestId, children: [_jsx(ReportGmailerrorredIcon, { fontSize: 'small', sx: { verticalAlign: 'middle', margin: '0 20px' } }), _jsx(Typography, { sx: { marginRight: '8px' }, children: text }), _jsx(Typography, { color: "primary", fontWeight: "bold", sx: { cursor: 'pointer', textDecoration: 'underline' }, onClick: onClick || (() => window.location.reload()), children: actionLaunchText })] }));
};
export default ApiError;
