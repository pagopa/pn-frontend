import { jsxs as _jsxs } from "react/jsx-runtime";
import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useIsMobile } from '../../hooks';
import PnDialogContent from './PnDialogContent';
import PnDialogActions from './PnDialogActions';
const PnDialog = (props) => {
    const isMobile = useIsMobile();
    const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);
    const title = Children.toArray(props.children).find((child) => isValidElement(child) && child.type === DialogTitle);
    const enrichedTitle = isValidElement(title)
        ? cloneElement(title, {
            ...title.props,
            sx: { ...title.props.sx, textAlign: textPosition, p: isMobile ? 3 : 4, pb: 2 },
        })
        : title;
    const content = Children.toArray(props.children).find((child) => isValidElement(child) && child.type === PnDialogContent);
    const actions = Children.toArray(props.children).find((child) => isValidElement(child) && child.type === PnDialogActions);
    return (_jsxs(Dialog, { ...props, "data-testid": "dialog", children: [title && enrichedTitle, content, actions] }));
};
export default PnDialog;
