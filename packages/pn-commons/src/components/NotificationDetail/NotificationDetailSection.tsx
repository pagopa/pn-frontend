import React from 'react';
import { Trans } from 'react-i18next';

import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import { IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
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
  isDelegate = true,
  isLessThan10Years,
  downloadFilesMessage,
}: Props) => {
  const getSecondaryElement = () => {
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

      <List sx={{ p: 0 }}>
        {isDelegate && (
          <ListItem
            disableGutters
            sx={{
              alignItems: 'flex-start',
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <ListItemText sx={{ p: 0 }}>
              <Typography variant="body2">
                {getLocalizedOrDefaultLabel(
                  'notifications',
                  'detail.notification-detail-section.recipient'
                )}
              </Typography>
              <Typography variant="sidenav" color="text.primary">
                {recipient.denomination} - {recipient.taxId}
              </Typography>
            </ListItemText>
          </ListItem>
        )}

        {!isLessThan10Years && (
          <MIAlert severity="warning">
            <Trans parent={React.Fragment} i18nKey={downloadFilesMessage} />
          </MIAlert>
        )}

        {isLessThan10Years && (
          <ListItem
            data-testid="aarBox"
            disableGutters
            secondaryAction={
              !isCancelled && (
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
              )
            }
            sx={{ alignItems: 'flex-start', pb: 0 }}
          >
            <ListItemText
              primary={getLocalizedOrDefaultLabel(
                'notifications',
                'detail.notification-detail-section.aar'
              )}
              primaryTypographyProps={{ paddingBottom: isCancelled ? 1 : 0 }}
              sx={{
                color: !isCancelled ? theme.palette.primary.light : theme.palette.text.primary,
              }}
              secondary={getSecondaryElement()}
            />
          </ListItem>
        )}
      </List>
    </MIPaper>
  );
};

export default NotificationDetailSection;
