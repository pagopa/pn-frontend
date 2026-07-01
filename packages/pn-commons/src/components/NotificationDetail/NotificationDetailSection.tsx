import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import { IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { MIPaper, theme } from '@pagopa/mui-italia';

import { NotificationDetailOtherDocument, NotificationDetailRecipient } from '../../models';

interface Props {
  recipient: NotificationDetailRecipient;
  clickHandler: (document: string | NotificationDetailOtherDocument | undefined) => void;
  documents: Array<NotificationDetailOtherDocument> | undefined;
  downloadFilesLink: string;
  disableDownloads: boolean;
}

const NotificationDetailSection = ({
  recipient,
  clickHandler,
  documents,
  downloadFilesLink,
  disableDownloads,
}: Props) => {
  console.log('NotificationDetailSection recipients:', recipient);
  console.log(downloadFilesLink);
  console.log(disableDownloads);
  return (
    <MIPaper padding={24}>
      <Typography component="h2" variant="h5" sx={{ mb: 1 }}>
        Dettagli della notifica
      </Typography>

      <List sx={{ p: 0 }}>
        <ListItem
          disableGutters
          sx={{
            alignItems: 'flex-start',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <ListItemText sx={{ p: 0 }}>
            <Typography variant="body2">Persona destinataria</Typography>
            <Typography variant="sidenav" color="text.primary">
              {recipient.denomination} - {recipient.taxId}
            </Typography>
          </ListItemText>
        </ListItem>

        <ListItem
          data-testid="aarBox"
          disableGutters
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="Apri avviso di Avvenuta ricezione"
              onClick={() => clickHandler(documents?.find((d) => d.documentType === 'AAR'))}
            >
              <OpenInBrowserRoundedIcon />
            </IconButton>
          }
          sx={{ alignItems: 'flex-start', pb: 0 }}
        >
          <ListItemText
            primary="Avviso di Avvenuta ricezione"
            sx={{ color: theme.palette.primary.light }}
            secondary={
              'Disponibile online per 10 anni dalla data in cui la notifica assume valore di legge'
            }
          />
        </ListItem>
      </List>
    </MIPaper>
  );
};

export default NotificationDetailSection;
