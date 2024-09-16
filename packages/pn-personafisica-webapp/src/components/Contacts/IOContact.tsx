import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { DisclaimerModal, IllusAppIO, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { IOAllowedValues } from '../../models/contacts';
import { disableIOAddress, enableIOAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import DigitalContactsCard from './DigitalContactsCard';

enum IOContactStatus {
  UNAVAILABLE = 'unavailable',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

const IOContact: React.FC = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const { defaultAPPIOAddress: contact } = useAppSelector(contactsSelectors.selectAddresses);

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
  const disclaimerLabel = status === IOContactStatus.ENABLED ? 'disable' : 'enable';

  const enableIO = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION);
    dispatch(enableIOAddress())
      .unwrap()
      .then(() => {
        setIsConfirmModalOpen(false);
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS);
      })
      .catch(() => {});
  };

  const disableIO = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_DEACTIVE_IO_UX_CONVERSION);
    dispatch(disableIOAddress())
      .unwrap()
      .then(() => {
        setIsConfirmModalOpen(false);
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_DEACTIVE_IO_UX_SUCCESS);
      })
      .catch(() => {});
  };

  const handleConfirm = () => {
    if (status === IOContactStatus.ENABLED) {
      disableIO();
    } else if (status === IOContactStatus.DISABLED) {
      enableIO();
    }
  };

  const handleModalOpen = () => {
    PFEventStrategyFactory.triggerEvent(
      status === IOContactStatus.ENABLED
        ? PFEventsType.SEND_DEACTIVE_IO_START
        : PFEventsType.SEND_ACTIVE_IO_START
    );
    setIsConfirmModalOpen(true);
  };

  const getContent = () => {
    if (status === IOContactStatus.UNAVAILABLE) {
      return (
        <Stack
          direction={{
            lg: 'row',
            xs: 'column',
          }}
          spacing={2}
          alignItems="center"
          mb={2}
          data-testid="ioContact"
        >
          <Alert severity="info" sx={{ width: isMobile ? '100%' : 'auto' }}>
            {t('io-contact.unavailable', { ns: 'recapiti' })}
          </Alert>
          <Button
            variant="contained"
            onClick={handleModalOpen}
            color="primary"
            fullWidth={isMobile}
          >
            {t('io-contact.download', { ns: 'recapiti' })}
          </Button>
        </Stack>
      );
    }
    if (status === IOContactStatus.DISABLED) {
      return (
        <>
          <Stack direction="row" spacing={2} alignItems="center" mb={2} data-testid="ioContact">
            <DoDisturbOnOutlinedIcon fontSize="small" color="disabled" />
            <Typography data-testid="IO status" fontWeight={600}>
              {t('io-contact.disabled', { ns: 'recapiti' })}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            onClick={handleModalOpen}
            color="primary"
            fullWidth={isMobile}
          >
            {t('io-contact.enable', { ns: 'recapiti' })}
          </Button>
        </>
      );
    }

    return (
      <Stack direction="row" spacing={1} data-testid="ioContact">
        <VerifiedIcon fontSize="small" color="primary" sx={{ position: 'relative', top: '2px' }} />
        <Box>
          <Typography data-testid="IO status" fontWeight={600} mb={2}>
            {t('io-contact.enabled', { ns: 'recapiti' })}
          </Typography>
          <ButtonNaked
            onClick={handleModalOpen}
            color="error"
            sx={{ fontWeight: 700 }}
            size="medium"
          >
            {t('button.disable')}
          </ButtonNaked>
        </Box>
      </Stack>
    );
  };

  return (
    <DigitalContactsCard
      title={t('io-contact.title', { ns: 'recapiti' })}
      subtitle={t('io-contact.description', { ns: 'recapiti' })}
      illustration={<IllusAppIO />}
    >
      {getContent()}
      <DisclaimerModal
        open={isConfirmModalOpen}
        onConfirm={handleConfirm}
        title={t(`io-contact.${disclaimerLabel}-modal.title`, { ns: 'recapiti' })}
        content={t(`io-contact.${disclaimerLabel}-modal.content`, { ns: 'recapiti' })}
        checkboxLabel={t(`io-contact.${disclaimerLabel}-modal.checkbox`, { ns: 'recapiti' })}
        confirmLabel={t(`io-contact.${disclaimerLabel}-modal.confirm`, { ns: 'recapiti' })}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </DigitalContactsCard>
  );
};

export default IOContact;
