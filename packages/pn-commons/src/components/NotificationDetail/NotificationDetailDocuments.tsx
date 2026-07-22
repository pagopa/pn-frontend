import React from 'react';
import { Trans } from 'react-i18next';

import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import { Box, Stack, Typography, TypographyProps, useTheme } from '@mui/material';
import {
  IllusMISingleFile,
  MIAlert,
  MIBoxedModule,
  MIBoxedModuleTitle,
  MIButton,
  MIPaper,
  Tag,
} from '@pagopa/mui-italia';

import {
  NotificationDetailDocument,
  NotificationDetailOtherDocument,
  NotificationDetailRecipient,
} from '../../models/NotificationDetail';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import { isNotificationDetailOtherDocument } from '../../utility/notification.utility';

type DocumentsProps = {
  documents?: Array<NotificationDetailDocument>;
  recipients?: Array<NotificationDetailRecipient>;
  clickHandler: (document: string | NotificationDetailOtherDocument | undefined) => void;
  disableDownloads?: boolean;
};

interface Props extends DocumentsProps {
  title: string;
  documentsAvailable?: boolean;
  downloadFilesMessage?: { key: string; ns: string };
  downloadFilesLink?: string;
  titleVariant?: TypographyProps['variant'];
}

const Documents: React.FC<DocumentsProps> = ({
  documents,
  recipients = [],
  disableDownloads,
  clickHandler,
}) => {
  const theme = useTheme();

  return documents?.map((d) => {
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
      <MIBoxedModule key={document.key} data-testid="notificationDetailDocuments">
        {!disableDownloads && (
          <Box
            component={MIButton}
            variant="text"
            endIcon={<OpenInBrowserIcon />}
            onClick={() => clickHandler(document.downloadHandler)}
            data-testid="documentButton"
            size="medium"
            fullWidth
            justifyContent="space-between"
            textAlign="left"
            sx={{
              overflowWrap: 'anywhere',
              '& .MuiButton-endIcon svg': {
                fontSize: '24px',
              },
            }}
          >
            {document.name}
          </Box>
        )}
        {disableDownloads && (
          <>
            <Box mb={1}>
              <MIBoxedModuleTitle>{document.name}</MIBoxedModuleTitle>
            </Box>
            <Tag
              icon={DoNotDisturbIcon}
              variant="default"
              value={getLocalizedOrDefaultLabel('common', 'not-available')}
              slotProps={{ icon: { color: theme.palette.grey[300] } }}
            />
          </>
        )}
      </MIBoxedModule>
    );
  });
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
) => (
  <Stack spacing={3}>
    <Typography
      id="notification-detail-document-attached"
      color="text.primary"
      variant={titleVariant}
      component="h2"
    >
      {title}
    </Typography>

    {/* Notification sent after expiration date (120 legal and 180 combo) */}
    {!disableDownloads && !documentsAvailable && downloadFilesMessage && (
      <MIAlert severity="warning" data-testid="documentsDisabled">
        <Trans i18nKey={downloadFilesMessage?.key} ns={downloadFilesMessage?.ns} />
      </MIAlert>
    )}

    {/* Notification sent before expiration date (120 legal and 180 combo) */}
    {documentsAvailable && downloadFilesMessage && (
      <MIPaper
        data-testid="documentsMessage"
        key="detail-documents-message"
        sx={{ backgroundColor: (theme) => theme.palette.grey[50] }}
        variant="outlined"
        padding={16}
      >
        <Stack direction="row" spacing={1}>
          <IllusMISingleFile size={40} />
          <Typography>
            <Trans
              i18nKey={downloadFilesMessage?.key}
              ns={downloadFilesMessage?.ns}
              components={[<strong key="0" />]}
            />
          </Typography>
        </Stack>
      </MIPaper>
    )}

    {/* Documents must be shown if the are documents and document is available or is not available but is cancelled */}
    {documents && (documentsAvailable || (!documentsAvailable && disableDownloads)) && (
      <Documents
        documents={documents}
        recipients={recipients}
        disableDownloads={disableDownloads}
        clickHandler={clickHandler}
      />
    )}
  </Stack>
);

export default NotificationDetailDocuments;
