import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Link, Tooltip } from '@mui/material';
import { useIsMobile } from '../hooks';
const CopyToClipboard = ({ getValue, text, tooltipMode, tooltip = '', tooltipBefore = '', disabled = false, }) => {
    const padding = tooltipMode ? 0 : undefined;
    const alertButtonStyle = useIsMobile()
        ? { textAlign: 'center', padding }
        : { textAlign: 'center', minWidth: 'max-content', padding };
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (copied) {
            setTimeout(() => setCopied(false), 2000);
        }
    }, [copied]);
    const doCopyToClipboard = async () => {
        const value = getValue();
        if ('clipboard' in navigator) {
            if (tooltipMode && !copied) {
                setCopied(true);
            }
            return await navigator.clipboard.writeText(value);
        }
        else {
            // execCommand is deprecated: we do not support IE so we return a console.log message
            // return document.execCommand('copy', true, value);
            console.log('Operation not supported');
        }
    };
    return (_jsxs(Button, { component: Link, color: "primary", sx: { ...alertButtonStyle }, onClick: doCopyToClipboard, disabled: disabled, "aria-label": copied ? tooltip : tooltipBefore, children: [copied && (_jsx(Tooltip, { arrow: true, title: tooltip, placement: "top", children: _jsx(CheckIcon, { fontSize: "small", sx: { m: '5px' } }) })), !copied && _jsx(ContentCopyIcon, { fontSize: "small", sx: { m: '5px' } }), text] }));
};
export default CopyToClipboard;
