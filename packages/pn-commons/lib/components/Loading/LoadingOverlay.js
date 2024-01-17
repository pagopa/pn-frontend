import { jsx as _jsx } from "react/jsx-runtime";
import { useSelector } from 'react-redux';
import { CircularProgress, Modal } from '@mui/material';
import { Box } from '@mui/system';
import { appStateSelectors } from '../../redux';
export function LoadingOverlay() {
    const loading = useSelector(appStateSelectors.selectLoading);
    return (_jsx(Modal, { open: loading, sx: { outline: 0 }, "data-testid": "loading-spinner", children: _jsx(Box, { sx: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100px',
                outline: 0,
            }, children: _jsx(CircularProgress, { id: "spinner-loading", role: "loadingSpinner", sx: { color: 'white' } }) }) }));
}
