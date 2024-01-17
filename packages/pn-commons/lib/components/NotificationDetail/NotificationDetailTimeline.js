import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Drawer, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TimelineNotification } from '@pagopa/mui-italia';
import { useIsMobile } from '../../hooks';
import NotificationDetailTimelineStep from './NotificationDetailTimelineStep';
const CustomDrawer = styled(Drawer)(() => ({
    '& .MuiDrawer-paper': {
        width: '100%',
    },
    '& .MuiTimeline-root': {
        marginTop: 0,
        paddingTop: 0,
    },
}));
/**
 * This component is responsible for rendering a timeline of notification details,
 * and it provides options to view the full timeline in a drawer for mobile users.
 * The component's render function returns a JSX structure that includes:
 * A grid container with a title.
 * A timeline of notification details (timelineComponent) based on the statusHistory prop.
 * A custom drawer component (CustomDrawer) that can be opened or closed by clicking an
 * icon. The drawer contains a copy of the timeline content, and its visibility
 * is controlled by the state variable.
 * @param recipients list of recipients
 * @param statusHistory notification macro-status history
 * @param clickHandler function called when user clicks on the download button
 * @param title title to show
 * @param historyButtonLabel label of the history button
 * @param showMoreButtonLabel label of show more button
 * @param showLessButtonLabel label of show less button
 * @param disableDownloads for disable downloads
 * @param isParty for specific render of notification
 * @param language used to translate months in timeline
 */
const NotificationDetailTimeline = ({ recipients, statusHistory, clickHandler, title, historyButtonLabel, showMoreButtonLabel, showLessButtonLabel, disableDownloads = false, isParty = true, language = 'it', handleTrackShowMoreLess, }) => {
    const [state, setState] = useState(false);
    const isMobile = useIsMobile();
    if (!isMobile && state) {
        setState(false);
    }
    const toggleHistoryDrawer = () => {
        setState(!state);
    };
    const getPosition = (index) => {
        if (index === 0) {
            return 'first';
        }
        if (index === statusHistory.length - 1) {
            return 'last';
        }
        return undefined;
    };
    const timelineComponent = statusHistory.map((t, i) => (_jsx(NotificationDetailTimelineStep, { timelineStep: t, recipients: recipients, position: getPosition(i), clickHandler: clickHandler, showMoreButtonLabel: showMoreButtonLabel, showLessButtonLabel: showLessButtonLabel, handleTrackShowMoreLess: handleTrackShowMoreLess, disableDownloads: disableDownloads, isParty: isParty, language: language }, `timeline_sep_${i}`)));
    return (_jsxs(Fragment, { children: [_jsx(Grid, { container: true, direction: "row", justifyContent: "space-between", alignItems: "center", "data-testid": "NotificationDetailTimeline", children: _jsx(Grid, { item: true, children: _jsx(Typography, { id: "notification-state", component: "h5", color: "text.primary", fontWeight: 700, textTransform: "uppercase", fontSize: 14, children: title }) }) }), _jsx(TimelineNotification, { children: isMobile && statusHistory.length > 0 ? (_jsx(NotificationDetailTimelineStep, { timelineStep: statusHistory[0], recipients: recipients, position: "first", clickHandler: clickHandler, historyButtonLabel: historyButtonLabel, showHistoryButton: true, historyButtonClickHandler: toggleHistoryDrawer, disableDownloads: disableDownloads, isParty: isParty })) : (timelineComponent) }), _jsxs(CustomDrawer, { anchor: "bottom", open: state, onClose: toggleHistoryDrawer, "data-testid": "notification-history-drawer", children: [_jsxs(Grid, { container: true, direction: "row", justifyContent: "space-between", alignItems: "center", sx: { p: 3 }, "data-testid": "notification-history-drawer-content", children: [_jsx(Grid, { item: true, children: _jsx(Typography, { id: "notification-state", color: "text.primary", fontWeight: 700, textTransform: "uppercase", fontSize: 14, children: title }) }), _jsx(Grid, { item: true, children: _jsx(CloseIcon, { "data-testid": "notification-drawer-close", onClick: toggleHistoryDrawer, sx: {
                                        color: 'action.active',
                                        width: '32px',
                                        height: '32px',
                                    } }) })] }), _jsx(Box, { sx: { px: 3, height: 'calc(100vh - 87px)', overflowY: 'scroll' }, children: _jsx(TimelineNotification, { children: timelineComponent }) })] })] }));
};
export default NotificationDetailTimeline;
