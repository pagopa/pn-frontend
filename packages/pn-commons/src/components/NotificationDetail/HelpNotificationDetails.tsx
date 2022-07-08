import { Grid, Typography, Divider } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WebIcon from '@mui/icons-material/Web';

import { getLocalizedOrDefaultLabel } from '../../services/localization.service';

interface HelpNotificationDetailsProps {
  title: string;
  subtitle: string;
  courtName: string;
  phoneNumber: string;
  mail: string;
  website: string;
}

/**
 * Getting help for the user's notification
 * @param title card title
 * @param subtitle card subtitle
 * @param courtName court name that user need to contact in order to get help
 * @param phoneNumber the phone number of the court
 * @param mail the email of the court
 * @param website the website of the court
 */
const HelpNotificationDetails: React.FC<HelpNotificationDetailsProps> = ({
  title,
  subtitle,
  courtName,
  phoneNumber,
  mail,
  website,
}) => (
  <>
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography color="text.primary" fontWeight={700} textTransform="uppercase" fontSize={14}>
          {title.toUpperCase()}
        </Typography>
      </Grid>
    </Grid>
    <Typography variant="body1" sx={{ mt: 1 }}>
      {subtitle} {courtName}.
    </Typography>
    <Grid container direction="row" alignItems="center" mt={2}>
      <ButtonNaked color="primary" startIcon={<LocalPhoneIcon />} href={`tel:${phoneNumber}`}>
        {phoneNumber}
      </ButtonNaked>
      <ButtonNaked
        color="primary"
        startIcon={<MailOutlineIcon />}
        sx={{ ml: 2 }}
        href={`mailto:${mail}`}
        target="_blank"
      >
        {mail}
      </ButtonNaked>
      <ButtonNaked color="primary" startIcon={<WebIcon />} sx={{ ml: 2 }} href={website}>
        {getLocalizedOrDefaultLabel('notifications', 'detail.help.goto', 'Vai al sito')}
      </ButtonNaked>
    </Grid>
    <Divider sx={{ mt: 2 }} />
    <Typography variant="body1" sx={{ mt: 2 }}>
      {getLocalizedOrDefaultLabel(
        'notifications',
        'detail.help.assistance',
        'Per problemi tecnici o domande relative a Piattaforma Notifiche, premi su “Assisistenza” in alto a destra.'
      )}
    </Typography>
  </>
);

export default HelpNotificationDetails;
