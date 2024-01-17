/// <reference types="react" />
import { TypographyProps } from '@mui/material';
import { NotificationDetailDocument, NotificationDetailOtherDocument } from '../../models';
type Props = {
    title: string;
    documents: Array<NotificationDetailDocument> | undefined;
    clickHandler: (document: string | NotificationDetailOtherDocument | undefined) => void;
    documentsAvailable?: boolean;
    downloadFilesMessage?: string;
    downloadFilesLink?: string;
    disableDownloads?: boolean;
    titleVariant?: TypographyProps['variant'];
};
/**
 * Notification detail documents
 * @param title title to show
 * @param documents data to show
 * @param clickHandler function called when user clicks on the download button
 * @param documentsAvailable flag that allows download file or not (after 120 days)
 * @param downloadFilesMessage disclaimer to show about downloadable acts
 * @param downloadFilesLink text to bring to
 * @param disableDownloads if notification is cancelled button naked is disabled
 */
declare const NotificationDetailDocuments: React.FC<Props>;
export default NotificationDetailDocuments;
