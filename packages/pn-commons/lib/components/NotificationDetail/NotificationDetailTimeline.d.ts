/// <reference types="react" />
import { LegalFactId, NotificationDetailOtherDocument, NotificationDetailRecipient, NotificationStatusHistory } from '../../models';
type Props = {
    recipients: Array<NotificationDetailRecipient>;
    statusHistory: Array<NotificationStatusHistory>;
    title: string;
    clickHandler: (legalFactId: LegalFactId | NotificationDetailOtherDocument) => void;
    historyButtonLabel: string;
    showMoreButtonLabel: string;
    showLessButtonLabel: string;
    eventTrackingCallbackShowMore?: () => void;
    disableDownloads?: boolean;
    isParty?: boolean;
    language?: string;
    handleTrackShowMoreLess?: (collapsed: boolean) => void;
};
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
declare const NotificationDetailTimeline: ({ recipients, statusHistory, clickHandler, title, historyButtonLabel, showMoreButtonLabel, showLessButtonLabel, disableDownloads, isParty, language, handleTrackShowMoreLess, }: Props) => JSX.Element;
export default NotificationDetailTimeline;
