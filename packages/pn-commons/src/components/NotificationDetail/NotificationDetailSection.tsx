import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper as MIPaper,
  Typography,
} from '@mui/material';
import { theme } from '@pagopa/mui-italia';

const NotificationDetailSection = () => {
  console.log('NotificationDetailSection rendered');
  return (
    <MIPaper>
      <Typography component="h2" variant="h5">
        Dettagli della notifica
      </Typography>

      <List>
        <ListItem disableGutters>
          <ListItemText sx={{ p: 0 }}>
            <Typography variant="body2">Persona destinataria</Typography>
            <Typography variant="sidenav" color="text.primary">
              Maria Rossi - MRARSS08S05I480N
            </Typography>
          </ListItemText>
        </ListItem>
        <Divider />

        <ListItem
          disableGutters
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
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
