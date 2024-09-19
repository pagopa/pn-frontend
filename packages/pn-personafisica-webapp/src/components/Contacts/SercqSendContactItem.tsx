import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import { appStateActions, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import {
  AddressType,
  ChannelType,
  IOAllowedValues,
  SERCQ_SEND_VALUE,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress, enableIOAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { internationalPhonePrefix } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import DigitalContactsCard from './DigitalContactsCard';
import PecDisableSercqDialog from './PecDisableSercqDialog';
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
  ADD_PEC = 'add_pec',
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
  const [modalOpen, setModalOpen] = useState<{ type: ModalType; data?: any } | null>(null);
  const dispatch = useAppDispatch();
  const { defaultSERCQAddress, defaultAPPIOAddress, courtesyAddresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const value = defaultSERCQAddress?.value ?? '';
  const hasAppIO = defaultAPPIOAddress?.value === IOAllowedValues.DISABLED;
  const hasCourtesy =
    hasAppIO && courtesyAddresses.length === 1 ? false : courtesyAddresses.length > 0;

  const handleInfoConfirm = () => {
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId,
      senderName,
      channelType: ChannelType.SERCQ,
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

  const handleCourtesyConfirm = (channelType: ChannelType, value: string) => {
    if (channelType === ChannelType.IOMSG) {
      dispatch(enableIOAddress())
        .unwrap()
        .then(() => setModalOpen(null))
        .catch(() => {});
      return;
    }
    handleCodeVerification(value, channelType);
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.LEGAL,
        senderId,
        channelType: ChannelType.SERCQ,
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
      <Box data-testid={`${senderId}_sercqSendContact`}>
        {!value && (
          <Button
            variant="contained"
            data-testid="activateButton"
            onClick={() => setModalOpen({ type: ModalType.INFO })}
          >
            {t('legal-contacts.sercq-send-active', { ns: 'recapiti' })}
          </Button>
        )}
        {value && (
          <Box>
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

            <Divider sx={{ color: 'text.secondary', mt: 4, mb: 2 }} />

            <Stack alignItems="baseline" direction="row" spacing={0.5}>
              <Typography variant="body2" color="textSecondary">
                {t(`legal-contacts.sercq-add-pec`, { ns: 'recapiti' })}
              </Typography>
              <ButtonNaked
                onClick={() =>
                  setModalOpen({ type: ModalType.ADD_PEC, data: { value: '', senders: [] } })
                }
                color="primary"
                size="small"
                p={{ xs: '0.5rem 0', sm: 1 }}
                data-testid="addMoreButton"
                sx={{ fontSize: '1rem' }}
              >
                {t(`legal-contacts.insert-pec`, { ns: 'recapiti' })}
              </ButtonNaked>
            </Stack>
          </Box>
        )}
      </Box>
      <SercqSendInfoDialog
        open={modalOpen?.type === ModalType.INFO}
        onDiscard={() => setModalOpen(null)}
        onConfirm={handleInfoConfirm}
      />
      <SercqSendCourtesyDialog
        open={modalOpen?.type === ModalType.COURTESY}
        hasAppIO={hasAppIO}
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
        removeModalTitle={t(`legal-contacts.remove-sercq-send-title`, { ns: 'recapiti' })}
        removeModalBody={t(`legal-contacts.remove-sercq-send-message`, { ns: 'recapiti' })}
        removeButtonLabel={t(`legal-contacts.remove-sercq-send-button`, { ns: 'recapiti' })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
      />
      <PecDisableSercqDialog
        open={modalOpen?.type === ModalType.ADD_PEC}
        handleClose={() => setModalOpen(null)}
      />
    </DigitalContactsCard>
  );
};

export default SercqSendContactItem;
