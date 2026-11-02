import { FC } from 'react';
import { Trans } from 'react-i18next';

import DoNotDisturbRoundedIcon from '@mui/icons-material/DoNotDisturbRounded';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import { Stack, Typography, useTheme } from '@mui/material';
import { MIAlert, MIBoxedModule, MIIconButton, MIPaper, Tag } from '@pagopa/mui-italia';

import { NotificationDetailOtherDocument, NotificationDocumentType } from '../../models';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

interface Props {
  clickHandler: (document: string | NotificationDetailOtherDocument | undefined) => void;
  documents: Array<NotificationDetailOtherDocument> | undefined;
  isCancelled: boolean;
  aarDocumentAvailable: boolean;
  downloadFilesMessage: { key: string; ns: string };
}

const NotificationDetailSection: FC<Props> = ({
  clickHandler,
  documents,
  isCancelled,
  aarDocumentAvailable,
  downloadFilesMessage,
}) => {
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
    if (!isCancelled && aarDocumentAvailable && aarDocuments.length === 1) {
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
        {!aarDocumentAvailable && (
          <MIAlert severity="warning" data-testid="aarDisabled">
            <Trans i18nKey={downloadFilesMessage.key} ns={downloadFilesMessage.ns} />
          </MIAlert>
        )}

        {aarDocumentAvailable && (
          <>
            {!isCancelled && aarDocuments.length > 1 && (
              <Typography variant="caption" color="text.secondary">
                <Trans
                  i18nKey={`${downloadFilesMessage.key}-plural`}
                  ns={downloadFilesMessage.ns}
                  components={[<strong key="strong" />]}
                />
              </Typography>
            )}
            {aarDocuments.map((document) => {
              const documentTitle = getAARTitle(document);

              return (
                <MIBoxedModule
                  key={document.documentId}
                  data-testid="aarBox"
                  action={
                    !isCancelled && (
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
                    )
                  }
                >
                  <Stack pb={0}>
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
                </MIBoxedModule>
              );
            })}
          </>
        )}
      </Stack>
    </MIPaper>
  );
};

export default NotificationDetailSection;
