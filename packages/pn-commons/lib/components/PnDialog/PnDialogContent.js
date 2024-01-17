import { jsxs as _jsxs } from "react/jsx-runtime";
import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { DialogContent, DialogContentText } from '@mui/material';
import { useIsMobile } from '../../hooks';
const PnDialogContent = (props) => {
    const isMobile = useIsMobile();
    const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);
    const subtitle = Children.toArray(props.children).find((child) => isValidElement(child) && child.type === DialogContentText);
    const othersChildren = Children.toArray(props.children).filter((child) => isValidElement(child) && child.type !== DialogContentText);
    const enrichedSubTitle = isValidElement(subtitle)
        ? cloneElement(subtitle, {
            ...subtitle.props,
            sx: { ...subtitle.props.sx, textAlign: textPosition },
        })
        : subtitle;
    return (_jsxs(DialogContent, { ...props, "data-testid": "dialog-content", sx: { ...props.sx, p: isMobile ? 3 : 4, textAlign: textPosition }, children: [subtitle && enrichedSubTitle, othersChildren] }));
};
export default PnDialogContent;
