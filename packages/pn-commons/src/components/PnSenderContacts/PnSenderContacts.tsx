import { useTranslation } from 'react-i18next';

import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import {
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { CopyToClipboard, useIsMobile } from '@pagopa-pn/pn-commons';
import { MIPaper } from '@pagopa/mui-italia';

type SenderContactsProps = {
  phone?: string;
  site?: string;
};

const PnSenderContacts = ({ phone, site }: SenderContactsProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const theme = useTheme();

  if (!phone && !site) {
    return null;
  }
  const websiteUrl = site && /^https?:\/\//i.test(site) ? site : `https://${site}`;

  return (
    <MIPaper sx={{ width: { xs: '100%', md: '42%' } }} padding={24}>
      <Stack>
        <Typography component="h2" variant="h5">
          {t('detail.contact_sender.title', { ns: 'notifiche' })}
        </Typography>

        <List>
          {phone && (
            <>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CallOutlinedIcon sx={{ color: theme.palette.grey[400] }} />
                  </ListItemIcon>
                </ListItemAvatar>

                <ListItemText
                  sx={{
                    p: 0,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography variant="body2">
                    {t('detail.contact_sender.phone', { ns: 'notifiche' })}
                  </Typography>

                  {isMobile ? (
                    <Link href={`tel:${phone}`} underline="always" color="primary">
                      {phone}
                    </Link>
                  ) : (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ width: '100%' }}
                    >
                      <Typography variant="sidenav" color="text.primary">
                        {phone}
                      </Typography>

                      <CopyToClipboard
                        getValue={() => phone}
                        tooltipMode
                        tooltip={t('detail.contact_sender.copy_phone', {
                          ns: 'notifiche',
                        })}
                      />
                    </Stack>
                  )}
                </ListItemText>
              </ListItem>

              {site && <Divider />}
            </>
          )}

          {site && (
            <ListItem disableGutters>
              <ListItemAvatar>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LanguageRoundedIcon sx={{ color: theme.palette.grey[400] }} />
                </ListItemIcon>
              </ListItemAvatar>

              <ListItemText sx={{ p: 0 }}>
                <Typography variant="body2">
                  {t('detail.contact_sender.website', { ns: 'notifiche' })}
                </Typography>

                <Link
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="always"
                >
                  {site}
                </Link>
              </ListItemText>
            </ListItem>
          )}
        </List>
      </Stack>
    </MIPaper>
  );
};

export default PnSenderContacts;
