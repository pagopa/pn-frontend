import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Grid, Typography } from '@mui/material';
/**
 * TitleBox element. It renders a Title (default variant is h1) and a subtitle (default variant is h5)
 */
const TitleBox = ({ title, titleButton, subTitle, mbTitle = 2, mtGrid, mbSubTitle, variantTitle = 'h1', variantSubTitle = 'h5', sx, ariaLabel, children, }) => (_jsxs(Grid, { id: "page-header-container", "aria-orientation": "horizontal", tabIndex: 0, container: true, mt: mtGrid, sx: sx, children: [title && (_jsxs(Grid, { id: "item", item: true, xs: 12, mb: mbTitle, children: [_jsx(Typography, { id: `${title}-page`, "data-testid": "titleBox", role: "heading", "aria-label": ariaLabel, "aria-selected": "true", variant: variantTitle, display: "inline-block", sx: { verticalAlign: 'middle' }, children: title }), titleButton] })), subTitle && (_jsx(Grid, { "aria-orientation": "horizontal", item: true, xs: 12, mb: mbSubTitle, children: _jsx(Typography, { id: "subtitle-page", variant: variantSubTitle, sx: { fontSize: '18px' }, component: typeof subTitle !== 'string' ? 'div' : 'p', children: subTitle }) })), _jsx(Grid, { "aria-orientation": "vertical", item: true, xs: 12, children: _jsx(Typography, { sx: { fontSize: '18px' }, children: children }) })] }));
export default TitleBox;
