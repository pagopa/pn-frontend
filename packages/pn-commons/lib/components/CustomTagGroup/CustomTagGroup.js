import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box } from '@mui/material';
import { Tag } from '@pagopa/mui-italia';
import CustomTooltip from '../CustomTooltip';
const TagIndicator = ({ boxProps, arrayChildren, visibleItems, dataTestId }) => (_jsx(Box, { ...boxProps, sx: { cursor: 'pointer', display: 'inline-block' }, "data-testid": dataTestId, children: _jsx(Tag, { value: `+${arrayChildren.length - visibleItems}` }) }));
const CustomTagGroup = ({ visibleItems, disableTooltip = false, onOpen, children, }) => {
    const arrayChildren = React.Children.count(children)
        ? children
        : [children];
    const isOverflow = visibleItems ? arrayChildren.length > visibleItems : false;
    const maxCount = isOverflow ? visibleItems : arrayChildren.length;
    return (_jsxs(_Fragment, { children: [arrayChildren.slice(0, maxCount).map((c) => c), isOverflow && (_jsxs(Box, { children: [!disableTooltip && (_jsx(CustomTooltip, { openOnClick: false, onOpen: onOpen, tooltipContent: _jsx(_Fragment, { children: arrayChildren.slice(visibleItems).map((c) => c) }), children: _jsx("div", { children: _jsx(TagIndicator, { boxProps: { role: 'button' }, arrayChildren: arrayChildren, visibleItems: visibleItems, dataTestId: "custom-tooltip-indicator" }) }) })), disableTooltip && (_jsx(TagIndicator, { dataTestId: "remaining-tag-indicator", arrayChildren: arrayChildren, visibleItems: visibleItems }))] }))] }));
};
export default CustomTagGroup;
