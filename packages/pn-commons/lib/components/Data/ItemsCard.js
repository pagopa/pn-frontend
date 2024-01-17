import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import { Box, Card, CardActions, CardContent, CardHeader, Grid, Typography, } from '@mui/material';
const cardStyle = {
    '& .card-header': {
        padding: 0,
    },
    '& .card-actions': {
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
    },
};
const ItemsCard = ({ cardHeader, cardBody, cardData, cardActions, sx, headerGridProps, testId = 'mobileCards', }) => {
    const cardHeaderTitle = (item) => (_jsxs(Grid, { container: true, spacing: 2, direction: "row", alignItems: "center", ...headerGridProps, children: [_jsx(Grid, { item: true, sx: { fontSize: '14px', fontWeight: 400 }, "data-testid": "cardHeaderLeft", ...cardHeader[0].gridProps, children: cardHeader[0].getLabel(item[cardHeader[0].id], item) }), cardHeader[1] && (_jsx(Grid, { item: true, sx: { fontSize: '14px', fontWeight: 400, textAlign: 'right' }, "data-testid": "cardHeaderRight", ...cardHeader[1].gridProps, children: cardHeader[1].getLabel(item[cardHeader[1].id], item) }))] }));
    return (_jsx(Box, { sx: { ...cardStyle, ...sx }, "data-testid": testId, children: cardData.map((data) => (_jsxs(Card, { raised: true, "data-testid": "itemCard", sx: {
                mb: 2,
                p: 3,
            }, children: [_jsx(CardHeader, { title: cardHeaderTitle(data), className: "card-header" }), _jsx(CardContent, { sx: { padding: 0, mt: 2, ':last-child': { padding: 0 } }, children: cardBody.map((body) => (_jsx(Box, { sx: { mb: 2 }, children: (!body.hideIfEmpty ||
                            (body.hideIfEmpty && body.getLabel(data[body.id], data))) && (_jsxs(Fragment, { children: [_jsx(Typography, { sx: { fontWeight: 'bold' }, variant: "caption", "data-testid": "cardBodyLabel", children: body.label }), !body.notWrappedInTypography && (_jsx(Typography, { variant: "body2", "data-testid": "cardBodyValue", children: body.getLabel(data[body.id], data) })), body.notWrappedInTypography && (_jsx("div", { "data-testid": "cardBodyValue", children: body.getLabel(data[body.id], data) }))] })) }, body.id))) }), _jsx(CardActions, { disableSpacing: true, className: "card-actions", children: cardActions &&
                        cardActions.map((action) => (_jsx(Box, { onClick: () => action.onClick(data), "data-testid": "cardAction", sx: { ml: 'auto' }, children: action.component }, action.id))) })] }, data.id))) }));
};
export default ItemsCard;
