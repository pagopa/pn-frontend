import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Divider, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { MIPaper } from '@pagopa/mui-italia';

const NotificationDetailSection = () => {
  console.log('NotificationDetailSection rendered');
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
              Maria Rossi - MRARSS08S05I480N
            </Typography>
          </ListItemText>
        </ListItem>
        <Divider />

        <ListItem
          disableGutters
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
              <ArrowForwardIosIcon />
            </IconButton>
          }
        >
          <ListItemText primary="Single-line item" secondary={'Secondary text'} />
        </ListItem>
      </List>
    </MIPaper>
  );
};

export default NotificationDetailSection;
