import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import { Divider, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { MIPaper, theme } from '@pagopa/mui-italia';

import { NotificationDetailRecipient } from '../../models';

interface Props {
  recipient: NotificationDetailRecipient; // Replace 'any' with the actual type of recipient
}

const NotificationDetailSection = ({ recipient }: Props) => {
  console.log('NotificationDetailSection rendered', recipient);
  return (
    <MIPaper padding={24}>
      <Typography component="h2" variant="h5">
        Dettagli della notifica
      </Typography>

      <List>
        <ListItem disableGutters>
          <ListItemText sx={{ p: 0 }}>
            <Typography variant="body2">Persona destinataria</Typography>
            <Typography variant="sidenav" color="text.primary">
              {recipient.denomination} - {recipient.taxId}
            </Typography>
          </ListItemText>
        </ListItem>
        <Divider />

        <ListItem
          disableGutters
          secondaryAction={
            <IconButton edge="end" aria-label="Apri Avviso di Avvenuta ricezione">
              <OpenInBrowserRoundedIcon />
            </IconButton>
          }
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
