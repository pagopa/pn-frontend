import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Grid, Stack, Typography, TypographyProps } from '@mui/material';
// import DownloadIcon from '@mui/icons-material/Download';
import { ButtonNaked } from '@pagopa/mui-italia';

import {
  NotificationDetailDocument,
  NotificationDetailOtherDocument,
  NotificationDetailRecipient,
} from '../../models/NotificationDetail';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import { isNotificationDetailOtherDocument } from '../../utility/notification.utility';

type Props = {
  title: string;
  documents: Array<NotificationDetailDocument> | undefined;
  recipients?: Array<NotificationDetailRecipient>;
  clickHandler: (document: string | NotificationDetailOtherDocument | undefined) => void;
  documentsAvailable?: boolean;
  downloadFilesMessage?: string;
  downloadFilesLink?: string;
  disableDownloads?: boolean;
  titleVariant?: TypographyProps['variant'];
};

/**
 *  Notification detail documents
 *  @param title title to show
 *  @param documents data to show
 *  @param recipient the notification recipients
 *  @param clickHandler function called when user clicks on the download button
 *  @param documentsAvailable flag that allows download file or not (after 120 days)
 *  @param downloadFilesMessage disclaimer to show about downloadable acts
 *  @param downloadFilesLink text to bring to
 *  @param disableDownloads if notification is cancelled button naked is disabled
 */

const NotificationDetailDocuments: React.FC<Props> = (
  {
    title,
    documents = [],
    recipients = [],
    clickHandler,
    documentsAvailable = true,
    downloadFilesMessage,
    disableDownloads = false,
    titleVariant = 'overline',
  } // TODO: remove comment when link ready downloadFilesLink
) => {
  const mapOtherDocuments = (
    documents: Array<NotificationDetailDocument | NotificationDetailOtherDocument>
  ) =>
    documents.map((d) => {
      const isOtherDocument = isNotificationDetailOtherDocument(d);
      const recipient =
        recipients.filter((recipient) => recipient.taxId).length > 1 && isOtherDocument
          ? ` - ${d.recipient?.denomination} (${d.recipient?.taxId})`
          : '';
      const docName = isOtherDocument
        ? `${getLocalizedOrDefaultLabel('notifications', 'detail.aar-acts')}${recipient}`
        : d.title || d.ref.key;

      const document = {
        key: d.ref.key || d.documentId,
        name: docName,
        downloadHandler: d.documentId
          ? {
              documentId: d.documentId,
              documentType: d.documentType,
              digests: d.digests,
              contentType: d.contentType,
              ref: d.ref,
            }
          : d.docIdx,
      };

      return (
        <Box key={document.key} data-testid="notificationDetailDocuments">
          {!documentsAvailable ? (
            <Typography
              sx={{ display: 'flex', alignItems: 'center' }}
              variant="button"
              color="text.disabled"
              fontSize={14}
            >
              <AttachFileIcon sx={{ mr: 1 }} fontSize="inherit" color="inherit" />
              {document.name}
            </Typography>
          ) : (
            <ButtonNaked
              id="document-button"
              data-testid="documentButton"
              color={'primary'}
              startIcon={<AttachFileIcon />}
              onClick={() => clickHandler(document.downloadHandler)}
              disabled={disableDownloads}
            >
              <Box
                sx={{
                  textOverflow: 'ellipsis',
                  maxWidth: {
                    xs: '15rem',
                    sm: '20rem',
                    md: '30rem',
                    lg: '24rem',
                    xl: '34rem',
                  },
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {document.name}
              </Box>
              <Typography sx={{ fontWeight: 600, ml: 1 }}>
                {''} {/* TODO: integrate specific dimension of file */}
              </Typography>
            </ButtonNaked>
          )}
        </Box>
      );
    });

  return (
    <>
      <Grid
        key="files-section"
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid key="detail-documents-title" item sx={{ mb: 3 }}>
          <Typography
            id="notification-detail-document-attached"
            color="text.primary"
            variant={titleVariant}
          >
            {title}
          </Typography>
        </Grid>
        {/* TODO: ripristinare quando sarà completata la issue pn-720 */}
        {/* !documentsAvailable &&
        <Grid item>
          <Button startIcon={<DownloadIcon />}>Scarica tutti i Documenti</Button>
        </Grid>
      */}
      </Grid>
      <Grid key="detail-documents-message" item data-testid="documentsMessage">
        <Stack direction="row">
          {downloadFilesMessage && (
            <Typography variant="body2" sx={{ mb: 3 }}>
              {downloadFilesMessage}
            </Typography>
          )}
          {/* TODO: remove comment when link ready downloadFilesLink &&
          <Typography onClick={() => console.log('link')}>{downloadFilesLink}</Typography>
        */}
        </Stack>
      </Grid>
      <Grid key="download-files-section" item>
        {documents && mapOtherDocuments(documents)}
      </Grid>
    </>
  );
};

export default NotificationDetailDocuments;
