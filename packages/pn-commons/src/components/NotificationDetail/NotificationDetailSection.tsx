import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import { IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { MIPaper, Tag, theme } from '@pagopa/mui-italia';

import { NotificationDetailOtherDocument, NotificationDetailRecipient } from '../../models';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

interface Props {
  recipient: NotificationDetailRecipient;
  clickHandler: (document: string | NotificationDetailOtherDocument | undefined) => void;
  documents: Array<NotificationDetailOtherDocument> | undefined;
  disableDownloads: boolean;
  isDelegate: boolean;
}

const NotificationDetailSection = ({
  recipient,
  clickHandler,
  documents,
  disableDownloads,
  isDelegate = true,
}: Props) => (
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

      <ListItem
        data-testid="aarBox"
        disableGutters
        secondaryAction={
          !disableDownloads && (
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
          primaryTypographyProps={{ paddingBottom: disableDownloads ? 1 : 0 }}
          sx={{
            color: !disableDownloads ? theme.palette.primary.light : theme.palette.text.primary,
          }}
          secondary={
            !disableDownloads ? (
              getLocalizedOrDefaultLabel(
                'notifications',
                'detail.notification-detail-section.availability'
              )
            ) : (
              <Tag
                value={getLocalizedOrDefaultLabel('common', 'not-available')}
                icon={BlockRoundedIcon}
              />
            )
          }
        />
      </ListItem>
    </List>
  </MIPaper>
);

export default NotificationDetailSection;
