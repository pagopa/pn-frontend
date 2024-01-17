import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography } from '@mui/material';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
const NotFound = () => (_jsxs(_Fragment, { children: [_jsx(Typography, { align: "center", color: "textPrimary", variant: "h4", "data-testid": "notFoundTitle", children: getLocalizedOrDefaultLabel('common', 'not-found.title', '404: La pagina che stai cercando non esiste') }), _jsx(Typography, { align: "center", color: "textPrimary", variant: "subtitle2", "data-testid": "notFoundDescription", children: getLocalizedOrDefaultLabel('common', 'not-found.description', 'Sei qui per errore, prova ad usare la navigazione.') })] }));
export default NotFound;
