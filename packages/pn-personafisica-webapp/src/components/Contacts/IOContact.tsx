import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { Button, Stack, Typography } from '@mui/material';
import { DisclaimerModal } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

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

  return (
    <DigitalContactsCard
      title={t('io-contact.title', { ns: 'recapiti' })}
      subtitle={t('io-contact.description', { ns: 'recapiti' })}
    >
      <Stack direction="row" spacing={1} alignItems="center" mb={2} data-testid="ioContact">
        {(status === IOContactStatus.UNAVAILABLE || status === IOContactStatus.PENDING) && (
          <>
            <CloseOutlinedIcon fontSize="small" color="disabled" />
            <Typography data-testid="IO status" fontWeight={600}>
              {t('io-contact.unavailable', { ns: 'recapiti' })}
            </Typography>
          </>
        )}
        {status === IOContactStatus.DISABLED && (
          <>
            <DoDisturbOnOutlinedIcon fontSize="small" color="disabled" />
            <Typography data-testid="IO status" fontWeight={600}>
              {t('io-contact.disabled', { ns: 'recapiti' })}
            </Typography>
          </>
        )}
        {status === IOContactStatus.ENABLED && (
          <>
            <VerifiedOutlinedIcon fontSize="small" color="primary" />
            <Typography data-testid="IO status" fontWeight={600}>
              {t('io-contact.enabled', { ns: 'recapiti' })}
            </Typography>
          </>
        )}
      </Stack>
      {status === IOContactStatus.DISABLED && (
        <Button variant="contained" onClick={handleModalOpen} color="primary">
          {t('io-contact.enable', { ns: 'recapiti' })}
        </Button>
      )}
      {status === IOContactStatus.ENABLED && (
        <ButtonNaked onClick={handleModalOpen} color="error" sx={{ px: 4 }}>
          {t('button.disable')}
        </ButtonNaked>
      )}
      {/* getDisclaimer() */}
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
