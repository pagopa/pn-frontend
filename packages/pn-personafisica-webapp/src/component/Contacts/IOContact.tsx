import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import { ButtonNaked, IllusSms } from '@pagopa/mui-italia';

import { DigitalAddress, IOAllowedValues } from '../../models/contacts';
import { useAppDispatch } from '../../redux/hooks';
import { disableIOAddress, enableIOAddress } from '../../redux/contact/actions';
import DigitalContactsCard from './DigitalContactsCard';

interface Props {
  recipientId: string;
  contact?: DigitalAddress | null | undefined;
}

enum IOContactStatus {
  PENDING = 'pending',
  UNAVAILABLE = 'unavailable',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

const IOContact: React.FC<Props> = ({ recipientId, contact }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<IOContactStatus>(IOContactStatus.PENDING);

  const parseContact = () => {
    if (contact === null) {
      setStatus(() => IOContactStatus.PENDING);
    } else if (contact === undefined) {
      setStatus(() => IOContactStatus.UNAVAILABLE);
    } else if (contact.value === IOAllowedValues.DISABLED) {
      setStatus(() => IOContactStatus.DISABLED);
    } else {
      setStatus(() => IOContactStatus.ENABLED);
    }
  };

  const enableIO = () =>
    dispatch(enableIOAddress(recipientId)).then(() => {
      setStatus(() => IOContactStatus.ENABLED);
    });

  const disableIO = () =>
    dispatch(disableIOAddress(recipientId)).then(() => {
      setStatus(() => IOContactStatus.DISABLED);
    });

  // const toggleIO = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   event.preventDefault();
  //   switch (status) {
  //     case IOContactStatus.ENABLED:
  //       void dispatch(disableIOAddress(recipientId)).then(() => {
  //         setStatus(() => IOContactStatus.DISABLED);
  //       });
  //       break;
  //     case IOContactStatus.DISABLED:
  //       void dispatch(enableIOAddress(recipientId)).then(() => {
  //         setStatus(() => IOContactStatus.ENABLED);
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // };

  useEffect(() => {
    parseContact();
  }, [contact]);

  const getContent = () => {
    if (status === IOContactStatus.UNAVAILABLE || status === IOContactStatus.PENDING) {
      return;
    } else {
      const content =
        status === IOContactStatus.DISABLED
          ? {
              Icon: <CloseIcon fontSize="small" color="disabled" />,
              text: t('io-contact.disabled', { ns: 'recapiti' }),
              btn: {
                text: t('button.enable'),
                callback: enableIO,
              },
            }
          : {
              Icon: <CheckIcon fontSize="small" color="success" />,
              text: t('io-contact.enabled', { ns: 'recapiti' }),
              btn: {
                text: t('button.disable'),
                callback: disableIO,
              },
            };
      return (
        <Stack direction="row" mt={3}>
          {content.Icon}
          <Typography ml={1}>{content.text}</Typography>
          <Box flexGrow={1} textAlign="right">
            <ButtonNaked color="primary" onClick={content.btn.callback}>
              {content.btn.text}
            </ButtonNaked>
          </Box>

          {/* <FormControlLabel
            control={
              <Switch
                aria-label=""
                color="primary"
                checked={status === IOContactStatus.ENABLED}
                onChange={toggleIO}
              />
            }
            label={t('io-contact.switch-label', { ns: 'recapiti' })}
          /> */}
        </Stack>
      );
    }
  };

  const getDisclaimer = () => {
    if (status === IOContactStatus.PENDING) {
      return;
    } else {
      return (
        <Alert
          sx={{ mt: 4 }}
          severity={status !== IOContactStatus.UNAVAILABLE ? 'info' : 'warning'}
          data-testid="AppIO contact disclaimer"
        >
          <Typography component="span" variant="body1">
            {status === IOContactStatus.UNAVAILABLE
              ? t('io-contact.disclaimer-message-unavailable', { ns: 'recapiti' })
              : t('io-contact.disclaimer-message', { ns: 'recapiti' })}{' '}
          </Typography>
          {/** 
           * Waiting for FAQs
            {isAvailable &&
              <Link href={URL_DIGITAL_NOTIFICATIONS} target="_blank" variant="body1">
                {t('io-contact.disclaimer-link', { ns: 'recapiti' })}
              </Link>
            }
          * */}
        </Alert>
      );
    }
  };

  return (
    <DigitalContactsCard
      sectionTitle={t('io-contact.title', { ns: 'recapiti' })}
      title={t('io-contact.subtitle', { ns: 'recapiti' })}
      subtitle={t('io-contact.description', { ns: 'recapiti' })}
      avatar={<IllusSms />}
    >
      {getContent()}
      {getDisclaimer()}
    </DigitalContactsCard>
  );
};

export default IOContact;
