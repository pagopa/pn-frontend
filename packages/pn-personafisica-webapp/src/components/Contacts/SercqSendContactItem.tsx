import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import {
  ConsentActionType,
  ConsentType,
  TosPrivacyConsent,
  appStateActions,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  ContactOperation,
  ContactSource,
  IOAllowedValues,
  SERCQ_SEND_VALUE,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import {
  acceptSercqSendTosPrivacy,
  createOrUpdateAddress,
  deleteAddress,
  getSercqSendTosPrivacyApproval,
} from '../../redux/contact/actions';
import { contactsSelectors, resetExternalEvent } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { internationalPhonePrefix } from '../../utility/contacts.utility';
import { isPFEvent } from '../../utility/mixpanel';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import DigitalContactsCard from './DigitalContactsCard';
import SercqSendCourtesyDialog from './SercqSendCourtesyDialog';
import SercqSendIODialog from './SercqSendIODialog';
import SercqSendInfoDialog from './SercqSendInfoDialog';

enum ModalType {
  INFO = 'info',
  COURTESY = 'courtesy',
  CODE = 'code',
  DELETE = 'delete',
  IO = 'io',
}

const SercqSendCardTitle: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);

  return (
    <Box data-testid="DigitalContactsCardTitle">
      <Chip label={t('badges.news')} color="primary" data-testid="newsBadge" sx={{ mb: 1 }} />
      <Typography
        color="text.primary"
        fontWeight={700}
        fontSize={18}
        variant="body1"
        sx={{ mb: '12px' }}
      >
        {t('legal-contacts.sercq-send-title', { ns: 'recapiti' })}
      </Typography>
    </Box>
  );
};

const SercqSendContactItem: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState<{ type: ModalType; data?: any } | null>(null);
  const dispatch = useAppDispatch();
  const {
    defaultSERCQ_SENDAddress,
    defaultAPPIOAddress,
    courtesyAddresses,
    specialPECAddresses,
    specialSERCQ_SENDAddresses,
  } = useAppSelector(contactsSelectors.selectAddresses);
  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);

  const tosPrivacy = useRef<Array<TosPrivacyConsent>>();
  const value = defaultSERCQ_SENDAddress?.value ?? '';
  const hasAppIO = defaultAPPIOAddress?.value === IOAllowedValues.DISABLED;
  const hasCourtesy =
    hasAppIO && courtesyAddresses.length === 1 ? false : courtesyAddresses.length > 0;
  const blockDelete = specialPECAddresses.length > 0 || specialSERCQ_SENDAddresses.length > 0;

  const handleActivation = () => {
    dispatch(getSercqSendTosPrivacyApproval())
      .unwrap()
      .then((consent) => {
        // eslint-disable-next-line functional/immutable-data
        tosPrivacy.current = consent;
        const source =
          externalEvent?.destination === ChannelType.SERCQ_SEND
            ? externalEvent?.source ?? ContactSource.RECAPITI
            : ContactSource.RECAPITI;
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_START, {
          senderId: 'default',
          source,
        });
        setModalOpen({ type: ModalType.INFO });
      })
      .catch(() => {});
  };

  const activateService = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_UX_CONVERSION, 'default');
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId: 'default',
      channelType: ChannelType.SERCQ_SEND,
      value: SERCQ_SEND_VALUE,
    };
    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_UX_SUCCESS, 'default');
        // show success message
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`legal-contacts.sercq_send-added-successfully`, { ns: 'recapiti' }),
          })
        );
        // here the user doesn't have a corutesy address
        if (!hasCourtesy) {
          setModalOpen({ type: ModalType.COURTESY });
          return;
        }
        // here the user has a courtesy address but AppIO disabled
        if (hasCourtesy && hasAppIO) {
          setModalOpen({ type: ModalType.IO });
          return;
        }
        // here the user has a courtesy address and AppIO enabled
        setModalOpen(null);
      })
      .catch(() => {});
  };

  const handleInfoConfirm = () => {
    if (!tosPrivacy.current) {
      return;
    }
    // first check tos and privacy status
    const [tos, privacy] = tosPrivacy.current.filter(
      (consent) =>
        consent.consentType === ConsentType.TOS_SERCQ ||
        consent.consentType === ConsentType.DATAPRIVACY_SERCQ
    );
    // if tos and privacy are already accepted, proceede with the activation
    if (tos.accepted && privacy.accepted) {
      activateService();
      return;
    }
    // accept tos and privacy
    const tosPrivacyBody = [];
    if (!tos.accepted) {
      // eslint-disable-next-line functional/immutable-data
      tosPrivacyBody.push({
        action: ConsentActionType.ACCEPT,
        version: tos.consentVersion,
        type: ConsentType.TOS_SERCQ,
      });
    }
    if (!privacy.accepted) {
      // eslint-disable-next-line functional/immutable-data
      tosPrivacyBody.push({
        action: ConsentActionType.ACCEPT,
        version: privacy.consentVersion,
        type: ConsentType.DATAPRIVACY_SERCQ,
      });
    }
    dispatch(acceptSercqSendTosPrivacy(tosPrivacyBody))
      .unwrap()
      .then(() => {
        activateService();
      })
      .catch(() => {});
  };

  const handleCodeVerification = (
    value: string,
    channelType: ChannelType,
    verificationCode?: string
  ) => {
    if (verificationCode) {
      const eventKey = `SEND_ADD_${channelType}_UX_CONVERSION`;
      if (isPFEvent(eventKey)) {
        PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey], 'default');
      }
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: 'default',
      channelType,
      value: channelType === ChannelType.SMS ? internationalPhonePrefix + value : value,
      code: verificationCode,
    };

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        // contact to verify
        // open code modal
        if (!res) {
          // aprire la code modal
          setModalOpen({ type: ModalType.CODE, data: { value, channelType } });
          return;
        }

        const eventKey = `SEND_ADD_${channelType}_UX_SUCCESS`;
        if (isPFEvent(eventKey)) {
          PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey], {
            senderId: 'default',
            fromSercqSend: true,
          });
        }

        // contact has already been verified
        // show success message
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.${channelType.toLowerCase()}-added-successfully`, {
              ns: 'recapiti',
            }),
          })
        );
        // AppIO enabled
        if (!hasAppIO) {
          setModalOpen(null);
          return;
        }
        // AppIO disabled
        setModalOpen({ type: ModalType.IO });
      })
      .catch(() => {});
  };

  const handleCourtesyConfirm = (channelType: ChannelType, value: string) => {
    const eventKey = `SEND_ADD_${channelType}_START`;
    if (isPFEvent(eventKey)) {
      const source =
        externalEvent?.destination === ChannelType.SERCQ_SEND
          ? externalEvent?.source ?? ContactSource.RECAPITI
          : ContactSource.RECAPITI;
      PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey], {
        senderId: 'default',
        source,
      });
    }
    handleCodeVerification(value, channelType);
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.LEGAL,
        senderId: 'default',
        channelType: ChannelType.SERCQ_SEND,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_SERCQ_SEND_SUCCESS, 'default');
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`legal-contacts.sercq_send-removed-successfully`, { ns: 'recapiti' }),
          })
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (
      externalEvent &&
      externalEvent.destination === ChannelType.SERCQ_SEND &&
      externalEvent.operation === ContactOperation.ADD
    ) {
      handleActivation();
      dispatch(resetExternalEvent());
    }
  }, [externalEvent]);

  return (
    <DigitalContactsCard
      title={
        value ? t('legal-contacts.sercq-send-title', { ns: 'recapiti' }) : <SercqSendCardTitle />
      }
      subtitle={t('legal-contacts.sercq-send-description', { ns: 'recapiti' })}
      expanded
      sx={{
        borderBottomLeftRadius: value ? 0 : 4,
        borderBottomRightRadius: value ? 0 : 4,
      }}
    >
      <Box data-testid={`default_sercqSendContact`} style={{ width: isMobile ? '100%' : '50%' }}>
        {!value && (
          <Button variant="contained" data-testid="activateButton" onClick={handleActivation}>
            {t('legal-contacts.sercq-send-active', { ns: 'recapiti' })}
          </Button>
        )}
        {value && (
          <Stack direction="row" spacing={1}>
            <VerifiedIcon
              fontSize="small"
              color="primary"
              sx={{ position: 'relative', top: '2px' }}
            />
            <Box>
              <Typography data-testid="sercq-send-status" fontWeight={600} mb={2}>
                {t('legal-contacts.sercq-send-enabled', { ns: 'recapiti' })}
              </Typography>
              <ButtonNaked
                onClick={() => setModalOpen({ type: ModalType.DELETE })}
                color="error"
                sx={{ fontWeight: 700 }}
                size="medium"
              >
                {t('button.disable')}
              </ButtonNaked>
            </Box>
          </Stack>
        )}
      </Box>
      <SercqSendInfoDialog
        open={modalOpen?.type === ModalType.INFO}
        onDiscard={() => setModalOpen(null)}
        onConfirm={handleInfoConfirm}
      />
      <SercqSendCourtesyDialog
        open={modalOpen?.type === ModalType.COURTESY}
        onDiscard={() => setModalOpen(null)}
        onConfirm={handleCourtesyConfirm}
      />
      <ContactCodeDialog
        value={modalOpen?.data?.value}
        addressType={AddressType.COURTESY}
        channelType={modalOpen?.data?.channelType ?? ChannelType.EMAIL}
        open={modalOpen?.type === ModalType.CODE}
        onConfirm={(code) =>
          handleCodeVerification(modalOpen?.data?.value, modalOpen?.data?.channelType, code)
        }
        onDiscard={() => setModalOpen(null)}
      />
      <DeleteDialog
        showModal={modalOpen?.type === ModalType.DELETE}
        removeModalTitle={t(
          `legal-contacts.${blockDelete ? 'block-' : ''}remove-sercq-send-title`,
          {
            ns: 'recapiti',
          }
        )}
        removeModalBody={t(
          `legal-contacts.${blockDelete ? 'block-' : ''}remove-sercq-send-message`,
          {
            ns: 'recapiti',
          }
        )}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />
      <SercqSendIODialog
        open={modalOpen?.type === ModalType.IO}
        onDiscard={() => setModalOpen(null)}
      />
    </DigitalContactsCard>
  );
};
export default SercqSendContactItem;
