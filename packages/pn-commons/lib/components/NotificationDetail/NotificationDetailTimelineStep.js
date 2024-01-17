import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useState } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { TimelineConnector } from '@mui/lab';
import { Box, Button, Chip, Typography } from '@mui/material';
import { ButtonNaked, TimelineNotificationContent, TimelineNotificationDot, TimelineNotificationItem, TimelineNotificationOppositeContent, TimelineNotificationSeparator, } from '@pagopa/mui-italia';
import { NotificationStatus, } from '../../models';
import { formatDay, formatMonthString, formatTime, getLegalFactLabel, getNotificationStatusInfos, getNotificationTimelineStatusInfos, } from '../../utility';
/**
 * Timeline step component
 * @param key unique key
 * @param oppositeContent element on the left
 * @param variant dot type
 * @param content element on the right
 * @param stepPosition step position
 * @param size dot size
 */
const timelineStepCmp = (key, oppositeContent, variant, content, stepPosition, size = 'default') => (_jsxs(TimelineNotificationItem, { children: [_jsx(TimelineNotificationOppositeContent, { children: oppositeContent }), _jsxs(TimelineNotificationSeparator, { children: [_jsx(TimelineConnector, { sx: { visibility: stepPosition === 'first' ? 'hidden' : 'visible' } }), _jsx(TimelineNotificationDot, { variant: variant, size: size }), _jsx(TimelineConnector, { sx: { visibility: stepPosition === 'last' ? 'hidden' : 'visible' } })] }), _jsx(TimelineNotificationContent, { children: content })] }, key));
/**
 * Notification detail timeline
 * This component used to display a timeline of events or notifications,
 * allowing users to expand and collapse additional details as needed.
 * The component's behavior and appearance can be customized by passing various props to it.
 * @param timelineStep data to show
 * @param recipients list of recipients
 * @param clickHandler function called when user clicks on the download button
 * @param position step position
 * @param showHistoryButton show history button
 * @param historyButtonLabel label for history button
 * @param historyButtonClickHandler function called when user clicks on the history button
 * @param showMoreButtonLabel label of show more button
 * @param showLessButtonLabel label of show less button
 * @param eventTrackingCallbackShowMore event tracking callback
 * @param completeStatusHistory the whole history, sometimes some information from a different status must be retrieved
 * @param disableDownloads if notification is disabled
 * @param isParty if is party chip rendered with opacity for status cancellation in progress
 * @param language used to translate months in timeline
 */
const NotificationDetailTimelineStep = ({ timelineStep, recipients, clickHandler, position = 'middle', showMoreButtonLabel, showLessButtonLabel, showHistoryButton = false, historyButtonLabel, historyButtonClickHandler, handleTrackShowMoreLess, disableDownloads, isParty = true, language = 'it', }) => {
    const [collapsed, setCollapsed] = useState(true);
    /* eslint-disable functional/no-let */
    let legalFactsIds = [];
    let visibleSteps = [];
    /* eslint-enable functional/no-let */
    const notificationStatusInfos = getNotificationStatusInfos(timelineStep, { recipients });
    if (timelineStep.steps) {
        /* eslint-disable functional/immutable-data */
        legalFactsIds = timelineStep.steps.reduce((arr, s) => {
            if (s.legalFactsIds && (collapsed || (!collapsed && s.hidden))) {
                return arr.concat(s.legalFactsIds.map((lf) => ({ file: lf, step: s })));
            }
            return arr;
        }, []);
        visibleSteps = timelineStep.steps.filter((s) => !s.hidden);
        /* eslint-enable functional/immutable-data */
    }
    const macroStep = timelineStepCmp(undefined, _jsxs(Fragment, { children: [_jsx(Typography, { color: "text.secondary", fontSize: 14, "data-testid": "dateItem", children: formatMonthString(timelineStep.activeFrom, language) }), _jsx(Typography, { fontWeight: 600, fontSize: 18, "data-testid": "dateItem", children: formatDay(timelineStep.activeFrom) })] }), position === 'first' ? 'outlined' : undefined, _jsxs(Fragment, { children: [_jsx(Typography, { color: "text.secondary", fontSize: 14, "data-testid": "dateItem", children: formatTime(timelineStep.activeFrom) }), _jsx(Chip, { id: `${notificationStatusInfos.label}-status`, "data-testid": "itemStatus", label: notificationStatusInfos.label, color: position === 'first' ? notificationStatusInfos.color : 'default', size: position === 'first' ? 'medium' : 'small', sx: {
                    opacity: timelineStep.status === NotificationStatus.CANCELLATION_IN_PROGRESS && isParty
                        ? '0.5'
                        : '1',
                } }), showHistoryButton && historyButtonLabel ? (_jsx(Button, { "data-testid": "historyButton", sx: { paddingLeft: 0, paddingRight: 0, marginTop: '5px' }, startIcon: _jsx(UnfoldMoreIcon, {}), onClick: historyButtonClickHandler, children: historyButtonLabel })) : (_jsxs(Box, { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }, children: [_jsx(Typography, { color: "text.primary", variant: "caption", children: notificationStatusInfos.description }), legalFactsIds &&
                        legalFactsIds.length > 0 &&
                        legalFactsIds.map((lf) => (_jsx(ButtonNaked, { startIcon: _jsx(AttachFileIcon, {}), onClick: () => clickHandler(lf.file), color: "primary", sx: { marginTop: '10px', textAlign: 'left' }, "data-testid": "download-legalfact", disabled: disableDownloads, children: getLegalFactLabel(lf.step, lf.file.category ||
                                lf.file.documentType, lf.file.key || '') }, lf.file.key ||
                            lf.file.documentId)))] }))] }), position);
    const handleShowMoreClick = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        handleTrackShowMoreLess && handleTrackShowMoreLess(!collapsed);
        setCollapsed(!collapsed);
    };
    const moreLessButton = timelineStepCmp(undefined, undefined, undefined, _jsx(Box, { "data-testid": "moreLessButton", children: _jsx(ButtonNaked, { id: "more-less-timeline-step", "data-testid": "more-less-timeline-step", startIcon: collapsed ? _jsx(UnfoldMoreIcon, {}) : _jsx(UnfoldLessIcon, {}), onClick: handleShowMoreClick, children: collapsed ? showMoreButtonLabel : showLessButtonLabel }) }), 'middle');
    const microStep = (s) => {
        const timelineStatusInfos = getNotificationTimelineStatusInfos(s, recipients, timelineStep.steps);
        if (!timelineStatusInfos) {
            return null;
        }
        return timelineStepCmp(s.elementId, _jsxs(Fragment, { children: [_jsx(Typography, { color: "text.secondary", fontSize: 14, "data-testid": "dateItemMicro", children: formatMonthString(s.timestamp, language) }), _jsx(Typography, { fontWeight: 600, fontSize: 18, "data-testid": "dateItemMicro", children: formatDay(s.timestamp) })] }), undefined, _jsxs(Fragment, { children: [_jsx(Typography, { color: "text.secondary", fontSize: 14, "data-testid": "dateItemMicro", children: formatTime(s.timestamp) }), _jsx(Typography, { color: "text.primary", fontSize: 14, fontWeight: 600, variant: "caption", letterSpacing: "0.5px", children: timelineStatusInfos.label }), _jsx(Box, { sx: { overflowWrap: 'anywhere' }, children: _jsxs(Typography, { color: "text.primary", fontSize: 14, children: [timelineStatusInfos.description, "\u00A0", s.legalFactsIds &&
                                s.legalFactsIds.length > 0 &&
                                s.legalFactsIds.map((lf) => (_jsx(Typography, { fontSize: 14, display: "inline", variant: "button", color: disableDownloads ? 'text.disabled' : 'primary', sx: { cursor: disableDownloads ? 'default' : 'pointer' }, onClick: () => clickHandler(lf), "data-testid": "download-legalfact-micro", children: getLegalFactLabel(s, lf.category ||
                                        lf.documentType, lf.key || '') }, lf.key || lf.documentId)))] }) })] }), 'middle', 'small');
    };
    return (_jsxs(Fragment, { children: [macroStep, !showHistoryButton && visibleSteps.length > 0 && moreLessButton, !collapsed && visibleSteps.map((s) => microStep(s))] }));
};
export default NotificationDetailTimelineStep;
