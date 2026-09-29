import { Trans } from 'react-i18next';

import DoNotDisturbRoundedIcon from '@mui/icons-material/DoNotDisturbRounded';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { MIAlert, MIIconButton, MIPaper, Tag } from '@pagopa/mui-italia';

import {
  NotificationDetailOtherDocument,
  NotificationDetailRecipient,
  NotificationDocumentType,
} from '../../models';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

interface Props {
  recipient: NotificationDetailRecipient;
  clickHandler: (document: string | NotificationDetailOtherDocument | undefined) => void;
  documents: Array<NotificationDetailOtherDocument> | undefined;
  isCancelled: boolean;
  isDelegate: boolean;
  aarDocumentAvailable: boolean;
  downloadFilesMessage: { key: string; ns: string };
}

const NotificationDetailSection = ({
  recipient,
  clickHandler,
  documents,
  isCancelled,
  isDelegate,
  aarDocumentAvailable,
  downloadFilesMessage,
}: Props) => {
  const theme = useTheme();

  const aarDocuments =
    documents?.filter((doc) => doc.documentType === NotificationDocumentType.AAR) ?? [];

  const getAARTitle = (document: NotificationDetailOtherDocument) => {
    const aarTitle =
      document.title ||
      getLocalizedOrDefaultLabel('notifications', 'detail.notification-detail-section.aar');

    if (aarDocuments.length <= 1 || !document.recipient) {
      return aarTitle;
    }

    return `${aarTitle} - ${document.recipient.denomination} (${document.recipient.taxId})`;
  };

  const getAARElement = () => {
    if (!isCancelled && aarDocumentAvailable) {
      return (
        <Typography variant="caption" color="text.secondary">
          <Trans
            i18nKey={downloadFilesMessage.key}
            ns={downloadFilesMessage.ns}
            components={[<strong key="strong" />]}
          />
        </Typography>
      );
    }
    if (isCancelled) {
      return (
        <Tag
          icon={DoNotDisturbRoundedIcon}
          variant="default"
          value={getLocalizedOrDefaultLabel('common', 'not-available')}
          slotProps={{ icon: { color: theme.palette.grey[300] } }}
        />
      );
    }
    return null;
  };

  return (
    <MIPaper padding={24} data-testid="aarDownload">
      <Stack spacing={2}>
        <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
          {getLocalizedOrDefaultLabel('notifications', 'detail.notification-detail-section.title')}
        </Typography>

        {isDelegate && (
          <Box
            pb={2}
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography component="h3" variant="body2">
              {getLocalizedOrDefaultLabel(
                'notifications',
                'detail.notification-detail-section.recipient'
              )}
            </Typography>
            <Typography variant="sidenav" color="text.primary">
              {recipient.denomination} - {recipient.taxId}
            </Typography>
          </Box>
        )}

        {!aarDocumentAvailable && (
          <MIAlert severity="warning" data-testid="aarDisabled">
            <Trans i18nKey={downloadFilesMessage.key} ns={downloadFilesMessage.ns} />
          </MIAlert>
        )}

        {aarDocumentAvailable &&
          aarDocuments.map((document) => {
            const documentTitle = getAARTitle(document);

            return (
              <Stack
                key={document.documentId}
                data-testid="aarBox"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                pb={0}
              >
                <Stack alignItems="flex-start">
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={(theme) =>
                      !isCancelled ? theme.palette.primary.main : theme.palette.text.primary
                    }
                    sx={{
                      paddingBottom: isCancelled ? 1 : 0,
                    }}
                  >
                    {documentTitle}
                  </Typography>
                  {getAARElement()}
                </Stack>
                {!isCancelled && (
                  <MIIconButton
                    data-testid="documentButton"
                    edge="end"
                    aria-label={`${getLocalizedOrDefaultLabel(
                      'notifications',
                      'detail.notification-detail-section.aria-label'
                    )}: ${documentTitle}`}
                    onClick={() => clickHandler(document)}
                  >
                    <OpenInBrowserRoundedIcon />
                  </MIIconButton>
                )}
              </Stack>
            );
          })}
      </Stack>
    </MIPaper>
  );
};

export default NotificationDetailSection;
