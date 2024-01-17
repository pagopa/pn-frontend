import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Grid, Skeleton, Stack } from '@mui/material';
const headerHeight = '128px';
const footerHeight = '139px';
const titleHeight = '36px';
const LoadingPage = ({ renderType = 'part', layout, sx }) => {
    if (renderType === 'whole') {
        return (_jsxs(Box, { p: 1, height: "100vh", sx: sx, "data-testid": "loading-skeleton", children: [_jsx(Skeleton, { variant: "rectangular", width: "100%", height: headerHeight, sx: { marginBottom: 1 }, "data-testid": "header" }), _jsxs(Stack, { height: `calc(100% - ${headerHeight} - ${footerHeight} - 16px)`, direction: { xs: 'column', lg: 'row' }, sx: { flexGrow: 1 }, children: [_jsx(Box, { sx: { width: { lg: 300 }, flexShrink: '0', marginRight: { lg: 1 } }, component: "nav", children: _jsx(Skeleton, { variant: "rectangular", width: "100%", height: "100%", "data-testid": "menu" }) }), _jsx(Box, { sx: { flexGrow: 1 }, component: "main", children: _jsx(Skeleton, { variant: "rectangular", width: "100%", height: "100%", "data-testid": "body" }) })] }), _jsx(Skeleton, { variant: "rectangular", width: "100%", height: footerHeight, sx: { marginTop: 1 }, "data-testid": "footer" })] }));
    }
    const pageLayout = layout ? (_jsx(Box, { height: `calc(100% - ${titleHeight} - 80px)`, "data-testid": "customContent", children: _jsx(Grid, { container: true, spacing: 2, children: layout.map((l) => (_jsx(Grid, { item: true, xs: l.xs, xl: l.xl, sm: l.sm, md: l.md, lg: l.lg, children: _jsx(Skeleton, { variant: "rectangular", width: "100%", height: "300px" }) }, l.id))) }) })) : (_jsx(Skeleton, { variant: "rectangular", width: "100%", height: `calc(100% - ${titleHeight} - 80px)`, "data-testid": "content" }));
    return (_jsxs(Box, { p: 2, height: "100%", sx: sx, "data-testid": "loading-skeleton", children: [_jsx(Skeleton, { variant: "rectangular", height: titleHeight, sx: { marginBottom: 2 }, "data-testid": "title" }), _jsx(Skeleton, { sx: { marginBottom: 4 }, "data-testid": "subTitle" }), pageLayout] }));
};
export default LoadingPage;
