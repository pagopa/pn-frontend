import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Avatar, Button, Chip, Stack, Typography } from '@mui/material';
import {
  IllusAppIO,
  IllusAppIoLogo,
  IllusSendLogo,
  PnInfoCard,
  appStateActions,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, IOAllowedValues } from '../../models/contacts';
import { disableIOAddress, enableIOAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import DeleteDialog from './DeleteDialog';
import InformativeDialog from './InformativeDialog';

enum IOContactStatus {
  UNAVAILABLE = 'unavailable',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

enum ModalType {
  INFORMATIVE = 'informative',
  DELETE = 'delete',
}

const IOContact: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const {
    defaultAPPIOAddress: contact,
    defaultSERCQ_SENDAddress,
    defaultPECAddress,
    addresses,
  } = useAppSelector(contactsSelectors.selectAddresses);
  const { APP_IO_SITE, APP_IO_ANDROID, APP_IO_IOS } = getConfiguration();

  const hasCourtesyAddresses =
    addresses.filter(
      (addr) => addr.addressType === AddressType.COURTESY && addr.value !== IOAllowedValues.DISABLED
    ).length > 0;

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

  const isAppIOEnabled = status === IOContactStatus.ENABLED;

  const hasDigitalDomicile = !!defaultSERCQ_SENDAddress || !!defaultPECAddress;

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
        setModalOpen(null);
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
    setModalOpen(ModalType.INFORMATIVE);
  };

  const handleOpenDeleteModal = () => {
    setModalOpen(ModalType.DELETE);
  };

  const handleConfirm = () => {
    PFEventStrategyFactory.triggerEvent(
      isAppIOEnabled ? PFEventsType.SEND_DEACTIVE_IO_START : PFEventsType.SEND_ACTIVE_IO_START
    );
    if (isAppIOEnabled) {
      disableIO();
      return;
    }
    enableIO();
    setModalOpen(null);
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
        <Button
          variant="contained"
          onClick={handleDownload}
          color="primary"
          fullWidth={isMobile}
          sx={{ mt: 3 }}
        >
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
          sx={{ mt: 3 }}
          id="ioContactButton"
        >
          {t('io-contact.enable', { ns: 'recapiti' })}
        </Button>
      );
    }
    return null;
  };

  const getChipColor = () => {
    if (isAppIOEnabled) {
      return 'success';
    }
    if (defaultSERCQ_SENDAddress && !hasCourtesyAddresses) {
      return 'warning';
    }
    return 'default';
  };

  const getRemoveModalMessage = () => {
    if (hasDigitalDomicile) {
      return (
        <Trans
          i18nKey="io-contact.disable-modal.content-dod-enabled"
          ns="recapiti"
          components={[
            <Typography variant="body2" fontSize={'18px'} key="p1" sx={{ mb: 2 }} />,
            <Typography variant="body2" fontSize={'18px'} key="p2" />,
          ]}
        />
      );
    }
    return t('io-contact.disable-modal.content', { ns: 'recapiti' });
  };

  return (
    <PnInfoCard
      title={
        <Typography
          variant="h6"
          fontSize={{ xs: '22px', lg: '24px' }}
          fontWeight={700}
          mb={2}
          data-testid="ioContactTitle"
        >
          {t('io-contact.title', { ns: 'recapiti' })}
        </Typography>
      }
      subtitle={
        <Chip
          label={t(`status.${isAppIOEnabled ? 'active' : 'inactive'}`, { ns: 'recapiti' })}
          color={getChipColor()}
          size="small"
          sx={{ mb: 2 }}
        />
      }
      actions={
        isAppIOEnabled
          ? [
              <ButtonNaked
                key="disable"
                onClick={handleOpenDeleteModal}
                color="error"
                startIcon={<PowerSettingsNewIcon />}
                sx={{ fontSize: '16px', color: 'error.dark' }}
              >
                {t('button.disable')}
              </ButtonNaked>,
            ]
          : undefined
      }
      expanded={isAppIOEnabled}
      slotProps={{ Card: { id: 'ioContactSection' } }}
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
      <Typography
        mt={2}
        variant="body1"
        fontSize={{ xs: '14px', lg: '16px' }}
        color="text.secondary"
        data-testid="ioContactDescription"
      >
        {isAppIOEnabled
          ? t('io-contact.description-enabled', { ns: 'recapiti' })
          : t('io-contact.description', { ns: 'recapiti' })}
      </Typography>
      {getButton()}
      <InformativeDialog
        open={modalOpen === ModalType.INFORMATIVE}
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
        onDiscard={() => setModalOpen(null)}
      />
      <DeleteDialog
        showModal={modalOpen === ModalType.DELETE}
        removeModalTitle={t('io-contact.disable-modal.title', { ns: 'recapiti' })}
        removeModalBody={getRemoveModalMessage()}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={disableIO}
        slotsProps={
          hasDigitalDomicile
            ? {
                primaryButton: {
                  onClick: () => setModalOpen(null),
                  label: t('button.annulla'),
                },
                secondaryButton: {
                  onClick: disableIO,
                  label: hasDigitalDomicile
                    ? t('io-contact.disable-modal.confirm-dod-enabled', { ns: 'recapiti' })
                    : t('button.disable'),
                  variant: 'outlined',
                  color: 'error',
                },
              }
            : undefined
        }
      />
    </PnInfoCard>
  );
};

export default IOContact;
