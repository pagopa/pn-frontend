import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import {
  IllusAppIO,
  IllusAppIoLogo,
  IllusSendLogo,
  appStateActions,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { IOAllowedValues } from '../../models/contacts';
import { disableIOAddress, enableIOAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import DigitalContactsCard from './DigitalContactsCard';
import InformativeDialog from './InformativeDialog';

enum IOContactStatus {
  UNAVAILABLE = 'unavailable',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

const IOContact: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const { defaultAPPIOAddress: contact, defaultSERCQ_SENDAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const { APP_IO_SITE, APP_IO_ANDROID, APP_IO_IOS } = getConfiguration();

  const parseContact = () => {
    if (!contact) {
      return IOContactStatus.UNAVAILABLE;
    } else if (contact.value === IOAllowedValues.DISABLED) {
      return IOContactStatus.DISABLED;
    } else {
      return IOContactStatus.ENABLED;
    }
  };

  const status = parseContact();
  // const disclaimerLabel = status === IOContactStatus.ENABLED ? 'disable' : 'enable';

  const enableIO = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION);
    dispatch(enableIOAddress())
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS, false);
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('courtesy-contacts.io-added-successfully', { ns: 'recapiti' }),
          })
        );
      })
      .catch(() => {});
  };

  const disableIO = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_DEACTIVE_IO_UX_CONVERSION);
    dispatch(disableIOAddress())
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_DEACTIVE_IO_UX_SUCCESS);
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('courtesy-contacts.io-removed-successfully', { ns: 'recapiti' }),
          })
        );
      })
      .catch(() => {});
  };

  const handleOpenInfoModal = () => {
    setOpenInfoModal(true);
  };

  const handleConfirm = () => {
    PFEventStrategyFactory.triggerEvent(
      status === IOContactStatus.ENABLED
        ? PFEventsType.SEND_DEACTIVE_IO_START
        : PFEventsType.SEND_ACTIVE_IO_START
    );
    if (status === IOContactStatus.ENABLED) {
      disableIO();
      return;
    }
    enableIO();
    setOpenInfoModal(false);
  };

  const handleDownload = () => {
    const androindPhone = /Android/i.test(navigator.userAgent);
    const iosPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (androindPhone && APP_IO_ANDROID) {
      window.location.assign(APP_IO_ANDROID);
    } else if (iosPhone && APP_IO_IOS) {
      window.location.assign(APP_IO_IOS);
    } else if (APP_IO_SITE) {
      window.location.assign(APP_IO_SITE);
    }
  };

  const getButton = () => {
    if (status === IOContactStatus.UNAVAILABLE) {
      return (
        <Button variant="contained" onClick={handleDownload} color="primary" fullWidth={isMobile}>
          {t('io-contact.download', { ns: 'recapiti' })}
        </Button>
      );
    }
    if (status === IOContactStatus.DISABLED) {
      return (
        <Button
          variant="contained"
          onClick={handleOpenInfoModal}
          color="primary"
          fullWidth={isMobile}
        >
          {t('io-contact.enable', { ns: 'recapiti' })}
        </Button>
      );
    }
    return null;
  };

  return (
    <DigitalContactsCard
      title={t('io-contact.title', { ns: 'recapiti' })}
      subtitle=""
      sx={{ pt: '1.5rem' }}
    >
      <Stack direction="row" alignItems="center" data-testid="ioContact">
        <Avatar variant="rounded" sx={{ bgcolor: '#0B3EE3', width: '36px', height: '36px' }}>
          <IllusAppIoLogo />
        </Avatar>
        <CompareArrowsIcon sx={{ width: '24px', height: '24px', mx: 1, color: 'text.secondary' }} />
        <Avatar variant="rounded" sx={{ bgcolor: '#0B3EE3', width: '36px', height: '36px' }}>
          <IllusSendLogo />
        </Avatar>
      </Stack>
      <Typography mt={3} variant="body1" color="text.secondary" data-testid="ioContactDescription">
        {status === IOContactStatus.ENABLED
          ? t('io-contact.description-enabled', { ns: 'recapiti' })
          : t('io-contact.description', { ns: 'recapiti' })}
      </Typography>
      <Box mt={3}>{getButton()}</Box>
      <InformativeDialog
        open={openInfoModal}
        title={t('io-contact.info-modal.title', { ns: 'recapiti' })}
        subtitle={t('io-contact.info-modal.subtitle', { ns: 'recapiti' })}
        content={
          !defaultSERCQ_SENDAddress
            ? t('io-contact.info-modal.content', { ns: 'recapiti' })
            : undefined
        }
        slotProps={
          !defaultSERCQ_SENDAddress
            ? {
                contentProps: {
                  color: 'text.secondary',
                  fontSize: '16px',
                },
              }
            : undefined
        }
        illustration={<IllusAppIO />}
        onConfirm={() => handleConfirm()}
        onDiscard={() => setOpenInfoModal(false)}
      />
    </DigitalContactsCard>
  );
};

export default IOContact;
