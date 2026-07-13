import React from 'react';
import { Trans } from 'react-i18next';

import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import { Box, IconButton, Typography } from '@mui/material';
import { MIAlert, MIPaper, Tag, theme } from '@pagopa/mui-italia';

import { NotificationDetailOtherDocument, NotificationDetailRecipient } from '../../models';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

interface Props {
  recipient: NotificationDetailRecipient;
  clickHandler: (document: string | NotificationDetailOtherDocument | undefined) => void;
  documents: Array<NotificationDetailOtherDocument> | undefined;
  isCancelled: boolean;
  isDelegate: boolean;
  isLessThan10Years: boolean;
  downloadFilesMessage: string;
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
  const getAARElement = () => {
    if (!isCancelled && isLessThan10Years) {
      return <Trans parent={React.Fragment} i18nKey={downloadFilesMessage} />;
    }
    if (isCancelled) {
      return (
        <Tag
          value={getLocalizedOrDefaultLabel('common', 'not-available')}
          icon={BlockRoundedIcon}
        />
      );
    }
    return null;
  };
  return (
    <MIPaper padding={24}>
      <Typography component="h2" variant="h5" sx={{ mb: 1 }}>
        {getLocalizedOrDefaultLabel('notifications', 'detail.notification-detail-section.title')}
      </Typography>

      {isDelegate && (
        <Box
          sx={{
            alignItems: 'flex-start',
            borderBottom: `1px solid ${theme.palette.divider}`,
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
          <Trans parent={React.Fragment} i18nKey={downloadFilesMessage} />
        </MIAlert>
      )}

      {isLessThan10Years && (
        <Box data-testid="aarBox" sx={{ alignItems: 'flex-start', pb: 0 }}>
          {!isCancelled && (
            <IconButton
              data-testid="documentButton"
              edge="end"
              aria-label={getLocalizedOrDefaultLabel(
                'notifications',
                'detail.notification-detail-section.aria-label'
              )}
              onClick={() => clickHandler(documents?.find((d) => d.documentType === 'AAR'))}
            >
              <OpenInBrowserRoundedIcon />
            </IconButton>
          )}
          <Typography
            sx={{
              paddingBottom: isCancelled ? 1 : 0,
              color: !isCancelled ? theme.palette.primary.light : theme.palette.text.primary,
            }}
          >
            {getLocalizedOrDefaultLabel('notifications', 'detail.notification-detail-section.aar')}
          </Typography>
          {getAARElement()}
        </Box>
      )}
    </MIPaper>
  );
};

export default NotificationDetailSection;
