import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography } from '@mui/material';
import { getLocalizedOrDefaultLabel } from '../services/localization.service';
const NotFound = () => (_jsxs("div", { children: [_jsx(Typography, { align: "center", color: "textPrimary", variant: "h4", children: getLocalizedOrDefaultLabel('common', 'not-found.title', '404: La pagina che stai cercando non esiste') }, void 0), _jsx(Typography, { align: "center", color: "textPrimary", variant: "subtitle2", children: getLocalizedOrDefaultLabel('common', 'not-found.description', 'Sei qui per errore, prova ad usare la navigazione.') }, void 0)] }, void 0));
export default NotFound;
