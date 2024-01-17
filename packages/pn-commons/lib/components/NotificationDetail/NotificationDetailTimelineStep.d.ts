/// <reference types="react" />
import { LegalFactId, NotificationDetailOtherDocument, NotificationDetailRecipient, NotificationStatusHistory } from '../../models';
type Props = {
    timelineStep: NotificationStatusHistory;
    recipients: Array<NotificationDetailRecipient>;
    clickHandler: (legalFactId: LegalFactId | NotificationDetailOtherDocument) => void;
    position?: 'first' | 'last' | 'middle';
    showMoreButtonLabel?: string;
    showLessButtonLabel?: string;
    showHistoryButton?: boolean;
    historyButtonLabel?: string;
    historyButtonClickHandler?: () => void;
    handleTrackShowMoreLess?: (collapsed: boolean) => void;
    disableDownloads?: boolean;
    isParty?: boolean;
    language?: string;
};
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
declare const NotificationDetailTimelineStep: ({ timelineStep, recipients, clickHandler, position, showMoreButtonLabel, showLessButtonLabel, showHistoryButton, historyButtonLabel, historyButtonClickHandler, handleTrackShowMoreLess, disableDownloads, isParty, language, }: Props) => JSX.Element;
export default NotificationDetailTimelineStep;
