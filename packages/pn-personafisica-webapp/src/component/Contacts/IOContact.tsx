import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, FormControlLabel, Link, Switch, Typography } from '@mui/material';
import { IllusSms } from '@pagopa/mui-italia';

import { URL_DIGITAL_NOTIFICATIONS } from '../../utils/constants';
import { DigitalAddress, IOAllowedValues } from '../../models/contacts';
import { useAppDispatch } from '../../redux/hooks';
import { disableIOAddress, enableIOAddress } from '../../redux/contact/actions';
import DigitalContactsCard from './DigitalContactsCard';

interface Props {
  recipientId: string;
  contact?: DigitalAddress | null;
}

const IOContact: React.FC<Props> = ({ recipientId, contact }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  /**
   * Parses the contact to enstablish if IO is available and,
   * if that's the case, to know it's value.
   */
  const parseContact = () => {
    setIsEnabled(() => false);
    if (!contact) {
      setIsAvailable(() => false);
    } else {
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
        void dispatch(disableIOAddress(recipientId))
          .unwrap()
          .then(() => {
            setIsEnabled(() => false);
          });
      } else {
        void dispatch(enableIOAddress(recipientId))
          .unwrap()
          .then(() => {
            setIsEnabled(() => true);
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
      {isAvailable && (
        <Box mt={3}>
          <FormControlLabel
            control={
              <Switch
                aria-label=""
                color="primary"
                disabled={!isAvailable}
                checked={isEnabled}
                onChange={toggleIO}
              />
            }
            label={t('io-contact.switch-label', { ns: 'recapiti' })}
          />
        </Box>
      )}
      <Alert sx={{ mt: 4 }} severity={isAvailable ? 'info' : 'warning'}>
        <Typography component="span" variant="body1">
          {isAvailable
            ? t('io-contact.disclaimer-message', { ns: 'recapiti' })
            : t('io-contact.disclaimer-message-unavailable', { ns: 'recapiti' })}{' '}
        </Typography>
        {isAvailable &&
          <Link href={URL_DIGITAL_NOTIFICATIONS} target="_blank" variant="body1">
            {t('io-contact.disclaimer-link', { ns: 'recapiti' })}
          </Link>
        }
      </Alert>
    </DigitalContactsCard>
  );
};

export default IOContact;
