import * as yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Grid, Typography, Divider } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WebIcon from '@mui/icons-material/Web';

import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { dataRegex } from '../../utils/string.utility';

interface HelpNotificationDetailsProps {
  title: string;
  subtitle: string;
  courtName: string;
  phoneNumber: string;
  mail: string;
  website: string;
}

interface ValidatedContactChannels {
  phoneNumber: string | null;
  mail: string | null;
  website: string | null;
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
}) => {
  const [validatedContactChannels, setValidatedContactChannels] = useState<ValidatedContactChannels>({
    phoneNumber: null,
    mail: null,
    website: null,
  });

  useEffect(() => {
    const fetchValidatedContactChannels = async () => {
      const validatedPhoneNumber = (await yup.string().matches(dataRegex.phoneNumber).isValid(phoneNumber)) ? phoneNumber : null;
      const validatedMail = (await yup.string().matches(dataRegex.email).isValid(mail)) ? mail : null;
      const validatedWebsite = (await yup.string().url().isValid(website)) ? website : null;
      setValidatedContactChannels({ 
        phoneNumber: validatedPhoneNumber,
        mail: validatedMail,
        website: validatedWebsite,
      });
    };
    void fetchValidatedContactChannels();
  }, [phoneNumber, mail, website]); 

  const someContactChannelPresent = useMemo(
    () => validatedContactChannels.phoneNumber || validatedContactChannels.mail || validatedContactChannels.website, 
    [validatedContactChannels]
  );

  return <>
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
    { someContactChannelPresent &&
      <Grid container direction="row" alignItems="center" mt={2}>
        { validatedContactChannels.phoneNumber && 
          <ButtonNaked color="primary" startIcon={<LocalPhoneIcon />} href={`tel:${validatedContactChannels.phoneNumber}`}>
            {validatedContactChannels.phoneNumber}
          </ButtonNaked>
        }
        { validatedContactChannels.mail && <ButtonNaked
          color="primary"
          startIcon={<MailOutlineIcon />}
          sx={{ ml: 2 }}
          href={`mailto:${validatedContactChannels.mail}`}
          target="_blank"
        >
          {validatedContactChannels.mail}
        </ButtonNaked> }
        { validatedContactChannels.website && 
          <ButtonNaked color="primary" startIcon={<WebIcon />} sx={{ ml: 2 }} href={validatedContactChannels.website}>
            {getLocalizedOrDefaultLabel('notifications', 'detail.help.goto', 'Vai al sito')}
          </ButtonNaked> 
        }
      </Grid>
    }
    { !someContactChannelPresent && <Typography variant="body1">(non ci sono trovati dati di contatto)</Typography> }
    <Divider sx={{ mt: 2 }} />
    <Typography variant="body1" sx={{ mt: 2 }}>
      {getLocalizedOrDefaultLabel(
        'notifications',
        'detail.help.assistance',
        'Per problemi tecnici o domande relative a Piattaforma Notifiche, premi su “Assisistenza” in alto a destra.'
      )}
    </Typography>
  </>
};

export default HelpNotificationDetails;
