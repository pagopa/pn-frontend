import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, FormControlLabel, Link, Switch, Typography } from '@mui/material';
import { IllusSms } from '@pagopa/mui-italia';

import { useAppDispatch } from '../../redux/hooks';
import { createOrUpdateCourtesyAddress, deleteCourtesyAddress } from '../../redux/contact/actions';
import { CourtesyChannelType, DigitalAddress } from '../../models/contacts';
import DigitalContactsCard from './DigitalContactsCard';

interface Props {
  recipientId: string;
  contact?: DigitalAddress | null;
}

enum IOAllowedValues {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED"
}

const IOContact: React.FC<Props> = ({ recipientId, contact }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const actionPayload = {
    recipientId,
    senderId: 'default',
    channelType: CourtesyChannelType.IOMSG,
  };

  const parseContact = () => {
    // TODO: verify if IO can be activated and is currently activated or not
    setIsEnabled(() => false);
    if (!contact) {
      setIsAvailable(() => false);
    }
    else{
      setIsAvailable(() => true);
      if (contact.value === IOAllowedValues.ENABLED) {
        setIsEnabled(() => true);
      } else {
        setIsEnabled(() => false);
      }
    }
  };

  const toggleIO = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (isAvailable) {
      if (isEnabled) {
        dispatch(deleteCourtesyAddress(actionPayload))
          .unwrap()
          .then(() => {
            setIsEnabled(() => false);
          })
          .catch((error) => {
            if (error.response.status === 406) {
              console.log('Error disabling IO');
            }
          });
      } else {
        dispatch(createOrUpdateCourtesyAddress({ ...actionPayload, value: 'appIO' }))
          .unwrap()
          .then(() => {
            setIsEnabled(() => true);
          })
          .catch((error) => {
            if (error.response.status === 406) {
              console.log('Error enabling IO');
            }
          });
      }
    }
  };

  useEffect(() => {
    parseContact();
  }, [contact]);

  return (
    <DigitalContactsCard
      sectionTitle={t('io-contact.title', { ns: 'recapiti' })}
      title={t('io-contact.subtitle', { ns: 'recapiti' })}
      subtitle={t('io-contact.description', { ns: 'recapiti' })}
      avatar={<IllusSms />}
    >
      <Box mt={3}>
        <FormControlLabel
          control={
            <Switch
              aria-label=""
              color="primary"
              disabled={!isAvailable}
              defaultChecked
              checked={isEnabled}
              onChange={toggleIO}
            />
          }
          label={t('io-contact.switch-label', { ns: 'recapiti' })}
        />
      </Box>
      {!isAvailable && (
        <Typography color="text.primary" fontWeight={400} fontSize={16}>
          {t('courtesy-contacts.io-enable', { ns: 'recapiti' })}
        </Typography>
      )}
      <Alert sx={{ mt: 4 }} severity="info">
        <Typography component="span" variant="body1">
          {t('io-contact.disclaimer-message', { ns: 'recapiti' })}{' '}
        </Typography>
        <Link href="#" variant="body1">
          {t('io-contact.disclaimer-link', { ns: 'recapiti' })}
        </Link>
      </Alert>
    </DigitalContactsCard>
  );
};

export default IOContact;
