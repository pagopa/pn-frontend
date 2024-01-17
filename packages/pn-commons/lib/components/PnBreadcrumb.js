import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Breadcrumbs, Stack, Typography, styled } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
const StyledLink = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: `${theme.palette.text.primary} !important`,
    textDecoration: 'none !important',
}));
const BreadcrumbLink = (props) => (_jsx(StyledLink, { ...props }));
const PnBreadcrumb = ({ goBackAction, goBackLabel, showBackAction = true, linkProps, linkRoute, linkLabel, currentLocationLabel, }) => {
    const navigate = useNavigate();
    const finalBackLabel = goBackLabel || getLocalizedOrDefaultLabel('common', 'button.indietro', 'Indietro');
    return (_jsxs(Stack, { direction: "row", alignItems: "center", justifyContent: "start", spacing: 3, children: [showBackAction && (_jsx(ButtonNaked, { id: "breadcrumb-indietro-button", color: "primary", "data-testid": "breadcrumb-indietro-button", startIcon: _jsx(ArrowBackIcon, {}), onClick: goBackAction ? goBackAction : () => navigate(-1), children: finalBackLabel })), _jsxs(Breadcrumbs, { "aria-label": "breadcrumb", children: [_jsx(BreadcrumbLink, { to: linkRoute, "data-testid": "breadcrumb-link", ...linkProps, children: linkLabel }), _jsx(Typography, { id: "title-of-page", color: "text.primary", fontWeight: 600, sx: { display: 'flex', alignItems: 'center' }, children: currentLocationLabel })] })] }));
};
export default PnBreadcrumb;
