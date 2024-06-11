import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { DisclaimerModal } from '@pagopa-pn/pn-commons';
import { ButtonNaked, IllusSms } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { DigitalAddress, IOAllowedValues } from '../../models/contacts';
import { disableIOAddress, enableIOAddress } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import DigitalContactsCard from './DigitalContactsCard';

interface Props {
  contact: DigitalAddress | null | undefined;
}

enum IOContactStatus {
  PENDING = 'pending',
  UNAVAILABLE = 'unavailable',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

const IOContact: React.FC<Props> = ({ contact }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();

  const parseContact = () => {
    if (contact === null) {
      return IOContactStatus.PENDING;
    } else if (contact === undefined) {
      return IOContactStatus.UNAVAILABLE;
    } else if (contact.value === IOAllowedValues.DISABLED) {
      return IOContactStatus.DISABLED;
    } else {
      return IOContactStatus.ENABLED;
    }
  };

  const status = parseContact();

  const enableIO = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION);
    void dispatch(enableIOAddress()).then(() => {
      setIsConfirmModalOpen(false);
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS);
    });
  };

  const disableIO = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_DEACTIVE_IO_UX_CONVERSION);
    void dispatch(disableIOAddress()).then(() => {
      setIsConfirmModalOpen(false);
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_DEACTIVE_IO_UX_SUCCESS);
    });
  };

  const handleConfirmationModal = () => {
    PFEventStrategyFactory.triggerEvent(
      status === IOContactStatus.ENABLED
        ? PFEventsType.SEND_DEACTIVE_IO_START
        : PFEventsType.SEND_ACTIVE_IO_START
    );
    setIsConfirmModalOpen(true);
  };

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
        <Stack direction="row" alignItems="center" mt={3}>
          {content.Icon}
          <Typography data-testid="IO status" ml={1}>
            {content.text}
          </Typography>
          <Box flexGrow={1} textAlign="right">
            <ButtonNaked color="primary" data-testid="IO button" onClick={handleConfirmationModal}>
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
          role="banner"
          sx={{ mt: 4 }}
          aria-label={
            status === IOContactStatus.UNAVAILABLE
              ? t('io-contact.disclaimer-message-unavailable', { ns: 'recapiti' })
              : t('io-contact.disclaimer-message', { ns: 'recapiti' })
          }
          severity={status !== IOContactStatus.UNAVAILABLE ? 'info' : 'warning'}
          data-testid="appIO-contact-disclaimer"
        >
          <Typography component="span" variant="body1" role="banner">
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
      avatar={<IllusSms size={60} />}
    >
      {getContent()}
      {getDisclaimer()}
      {status === IOContactStatus.DISABLED && isConfirmModalOpen && (
        <DisclaimerModal
          onConfirm={enableIO}
          title={t('io-contact.enable-modal.title', { ns: 'recapiti' })}
          content={t('io-contact.enable-modal.content', { ns: 'recapiti' })}
          checkboxLabel={t('io-contact.enable-modal.checkbox', { ns: 'recapiti' })}
          confirmLabel={t('io-contact.enable-modal.confirm', { ns: 'recapiti' })}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
      {status === IOContactStatus.ENABLED && isConfirmModalOpen && (
        <DisclaimerModal
          onConfirm={disableIO}
          title={t('io-contact.disable-modal.title', { ns: 'recapiti' })}
          content={t('io-contact.disable-modal.content', { ns: 'recapiti' })}
          checkboxLabel={t('io-contact.disable-modal.checkbox', { ns: 'recapiti' })}
          confirmLabel={t('io-contact.disable-modal.confirm', { ns: 'recapiti' })}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </DigitalContactsCard>
  );
};

export default IOContact;
