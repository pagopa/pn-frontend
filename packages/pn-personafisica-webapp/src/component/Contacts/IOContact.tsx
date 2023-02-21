import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import { ButtonNaked, IllusSms } from '@pagopa/mui-italia';
import { DisclaimerModal } from '@pagopa-pn/pn-commons';

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
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
      setIsConfirmModalOpen(false);
    });

  const disableIO = () =>
    dispatch(disableIOAddress(recipientId)).then(() => {
      setStatus(() => IOContactStatus.DISABLED);
      setIsConfirmModalOpen(false);
    });

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
              btn: t('button.enable'),
            }
          : {
              Icon: <CheckIcon fontSize="small" color="success" />,
              text: t('io-contact.enabled', { ns: 'recapiti' }),
              btn: t('button.disable'),
            };
      return (
        <Stack direction="row" mt={3}>
          {content.Icon}
          <Typography ml={1}>{content.text}</Typography>
          <Box flexGrow={1} textAlign="right">
            <ButtonNaked color="primary" onClick={() => setIsConfirmModalOpen(true)}>
              {content.btn}
            </ButtonNaked>
          </Box>
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
      {status === IOContactStatus.DISABLED && (
        <DisclaimerModal
          open={isConfirmModalOpen}
          onConfirm={enableIO}
          title={t('io-contact.enable-modal.title', { ns: 'recapiti' })}
          confirmLabel={t('io-contact.enable-modal.confirm-label', { ns: 'recapiti' })}
          content={t('io-contact.enable-modal.content', { ns: 'recapiti' })}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
      {status === IOContactStatus.ENABLED && (
        <DisclaimerModal
          open={isConfirmModalOpen}
          onConfirm={disableIO}
          title={t('io-contact.disable-modal.title', { ns: 'recapiti' })}
          confirmLabel={t('io-contact.disable-modal.confirm-label', { ns: 'recapiti' })}
          content={t('io-contact.disable-modal.content', { ns: 'recapiti' })}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </DigitalContactsCard>
  );
};

export default IOContact;
