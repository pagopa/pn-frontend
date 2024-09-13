import { useRef, useState } from 'react';
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

import {
  AddressType,
  ChannelType,
  SERCQ_SEND_VALUE,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import {
  acceptSercqSendTosPrivacy,
  createOrUpdateAddress,
  deleteAddress,
  getSercqSendTosPrivacyApproval,
} from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { internationalPhonePrefix } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import DigitalContactsCard from './DigitalContactsCard';
import SercqSendCourtesyDialog from './SercqSendCourtesyDialog';
import SercqSendInfoDialog from './SercqSendInfoDialog';

type Props = {
  senderId?: string;
  senderName?: string;
};

enum ModalType {
  INFO = 'info',
  COURTESY = 'courtesy',
  CODE = 'code',
  DELETE = 'delete',
}

const SercqSendCardTitle: React.FC = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const isMobile = useIsMobile();

  return (
    <Stack
      direction={isMobile ? 'column-reverse' : 'row'}
      spacing={1}
      alignItems={isMobile ? 'start' : 'center'}
      mb={2}
      data-testid="DigitalContactsCardTitle"
    >
      <Typography color="text.primary" fontWeight={700} fontSize={18} variant="body1">
        {t('legal-contacts.sercq-send-title', { ns: 'recapiti' })}
      </Typography>
      <Chip
        label={t('badges.news')}
        color="primary"
        data-testid="newsBadge"
        sx={{ borderRadius: 1 }}
      />
    </Stack>
  );
};

const SercqSendContactItem: React.FC<Props> = ({ senderId = 'default', senderName }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState<{ type: ModalType; data?: any } | null>(null);
  const dispatch = useAppDispatch();
  const { defaultSERCQ_SENDAddress, courtesyAddresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const tosPrivacy = useRef<Array<TosPrivacyConsent>>();

  const value = defaultSERCQ_SENDAddress?.value ?? '';
  const hasCourtesy = courtesyAddresses.length > 0;

  const handleActivation = () => {
    dispatch(getSercqSendTosPrivacyApproval())
      .unwrap()
      .then((consent) => {
        // eslint-disable-next-line functional/immutable-data
        tosPrivacy.current = consent;
        setModalOpen({ type: ModalType.INFO });
      })
      .catch(() => {});
  };

  const activateService = () => {
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId,
      senderName,
      channelType: ChannelType.SERCQ_SEND,
      value: SERCQ_SEND_VALUE,
    };
    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then(() => {
        // show success message
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`legal-contacts.sercq-send-added-successfully`, { ns: 'recapiti' }),
          })
        );
        if (hasCourtesy) {
          // close dialog
          setModalOpen(null);
          return;
        }
        setModalOpen({ type: ModalType.COURTESY });
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
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId,
      senderName,
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
        setModalOpen(null);
      })
      .catch(() => {});
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.LEGAL,
        senderId,
        channelType: ChannelType.SERCQ_SEND,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`legal-contacts.sercq-send-removed-successfully`, { ns: 'recapiti' }),
          })
        );
      })
      .catch(() => {});
  };

  return (
    <DigitalContactsCard
      title={
        value ? t('legal-contacts.sercq-send-title', { ns: 'recapiti' }) : <SercqSendCardTitle />
      }
      subtitle={t('legal-contacts.sercq-send-description', { ns: 'recapiti' })}
    >
      <Box
        data-testid={`${senderId}_sercqSendContact`}
        style={{ width: isMobile ? '100%' : '50%' }}
      >
        {!value && (
          <Button variant="contained" data-testid="activateButton" onClick={handleActivation}>
            {t('legal-contacts.sercq-send-active', { ns: 'recapiti' })}
          </Button>
        )}
        {value && (
          <Stack direction="row" spacing={2}>
            <VerifiedIcon
              fontSize="small"
              color="success"
              sx={{ position: 'relative', top: '2px' }}
            />
            <Box>
              <Typography data-testid="IO status" fontWeight={600}>
                {t('legal-contacts.sercq-send-enabled', { ns: 'recapiti' })}
              </Typography>
              <ButtonNaked onClick={() => setModalOpen({ type: ModalType.DELETE })} color="error">
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
        onConfirm={(channelType, value) => handleCodeVerification(value, channelType)}
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
        removeModalTitle={t(`legal-contacts.remove-sercq-send-title`, { ns: 'recapiti' })}
        removeModalBody={t(`legal-contacts.remove-sercq-send-message`, { ns: 'recapiti' })}
        removeButtonLabel={t(`legal-contacts.remove-sercq-send-button`, { ns: 'recapiti' })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
      />
    </DigitalContactsCard>
  );
};

export default SercqSendContactItem;
