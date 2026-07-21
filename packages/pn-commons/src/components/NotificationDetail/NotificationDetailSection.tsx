import { Trans } from 'react-i18next';

import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { MIAlert, MIIconButton, MIPaper, Tag } from '@pagopa/mui-italia';

import { NotificationDetailOtherDocument, NotificationDetailRecipient } from '../../models';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

interface Props {
  recipient: NotificationDetailRecipient;
  clickHandler: (document: string | NotificationDetailOtherDocument | undefined) => void;
  documents: Array<NotificationDetailOtherDocument> | undefined;
  isCancelled: boolean;
  isDelegate: boolean;
  isLessThan10Years: boolean;
  downloadFilesMessage: { key: string; ns: string };
}

const NotificationDetailSection = ({
  recipient,
  clickHandler,
  documents,
  isCancelled,
  isDelegate,
  isLessThan10Years,
  downloadFilesMessage,
}: Props) => {
  const theme = useTheme();

  const getAARElement = () => {
    if (!isCancelled && isLessThan10Years) {
      return <Trans i18nKey={downloadFilesMessage.key} ns={downloadFilesMessage.ns} />;
    }
    if (isCancelled) {
      return (
        <Tag
          icon={DoNotDisturbIcon}
          variant="default"
          value={getLocalizedOrDefaultLabel('common', 'not-available')}
          slotProps={{ icon: { color: theme.palette.grey[300] } }}
        />
      );
    }
    return null;
  };

  return (
    <MIPaper padding={24}>
      <Stack spacing={2}>
        <Typography component="h2" variant="h5" sx={{ mb: 1 }}>
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

        {!isLessThan10Years && (
          <MIAlert severity="warning">
            <Trans i18nKey={downloadFilesMessage.key} ns={downloadFilesMessage.ns} />
          </MIAlert>
        )}

        {isLessThan10Years && (
          <Stack
            data-testid="aarBox"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            pb={0}
          >
            <Stack>
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
                {getLocalizedOrDefaultLabel(
                  'notifications',
                  'detail.notification-detail-section.aar'
                )}
              </Typography>
              <Typography variant="caption" color="text.primary">
                {getAARElement()}
              </Typography>
            </Stack>
            {!isCancelled && (
              <MIIconButton
                data-testid="documentButton"
                edge="end"
                aria-label={getLocalizedOrDefaultLabel(
                  'notifications',
                  'detail.notification-detail-section.aria-label'
                )}
                onClick={() => clickHandler(documents?.find((d) => d.documentType === 'AAR'))}
              >
                <OpenInBrowserRoundedIcon />
              </MIIconButton>
            )}
          </Stack>
        )}
      </Stack>
    </MIPaper>
  );
};

export default NotificationDetailSection;
