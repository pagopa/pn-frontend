import { useTranslation } from 'react-i18next';

import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { MIPaper } from '@pagopa/mui-italia';

type SenderContactsProps = {
  phone?: string;
  site?: string;
};

const PnSenderContacts = ({ phone, site }: SenderContactsProps) => {
  const { t } = useTranslation();

  if (!phone && !site) {
    return null;
  }

  return (
    <MIPaper sx={{ p: 3, width: { xs: '100%', md: '42%' } }} variant="outlined">
      <Stack spacing={2}>
        <Typography component="h2" variant="h5">
          {t('detail.contact_sender.title', { ns: 'notifiche' })}
        </Typography>

        <List>
          {phone && (
            <>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CallOutlinedIcon />
                  </ListItemIcon>
                </ListItemAvatar>

                <ListItemText sx={{ p: 0 }}>
                  <Typography variant="body2">
                    {t('detail.contact_sender.phone', { ns: 'notifiche' })}
                  </Typography>

                  <Typography variant="sidenav" color="text.primary">
                    {phone}
                  </Typography>
                </ListItemText>
              </ListItem>

              {site && <Divider />}
            </>
          )}

          {site && (
            <ListItem disableGutters>
              <ListItemAvatar>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LanguageRoundedIcon />
                </ListItemIcon>
              </ListItemAvatar>

              <ListItemText sx={{ p: 0 }}>
                <Typography variant="body2">
                  {t('detail.contact_sender.website', { ns: 'notifiche' })}
                </Typography>

                <Typography variant="sidenav" color="text.primary">
                  {site}
                </Typography>
              </ListItemText>
            </ListItem>
          )}
        </List>
      </Stack>
    </MIPaper>
  );
};

export default PnSenderContacts;
