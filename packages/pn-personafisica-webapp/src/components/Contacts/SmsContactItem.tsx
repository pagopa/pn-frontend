import { JSXElementConstructor, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import {
  Box,
  Button,
  ButtonProps,
  Chip,
  TextFieldProps,
  Typography,
  TypographyProps,
} from '@mui/material';
import { PnInfoCard, appStateActions } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  ContactSource,
  IOAllowedValues,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import {
  DIGITAL_DOMICILE_ACTIVATION,
  DIGITAL_DOMICILE_MANAGEMENT,
} from '../../navigation/routes.const';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists, internationalPhonePrefix } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import DigitalContact from './DigitalContact';
import ExistingContactDialog from './ExistingContactDialog';
import InformativeDialog from './InformativeDialog';
import SpecialContacts from './SpecialContacts';

enum ModalType {
  EXISTING = 'existing',
  CODE = 'code',
  DELETE = 'delete',
  INFORMATIVE = 'informative',
}

interface SmsSlots {
  label?: JSXElementConstructor<TypographyProps>;
}

interface SmsSlotsProps {
  textField?: Partial<TextFieldProps>;
  button?: Partial<ButtonProps>;
}

interface SmsElemProps {
  slots?: SmsSlots;
  slotsProps?: SmsSlotsProps;
  beforeValidationCallback?: (value: string, errors?: string) => void;
  onCancelInsert?: () => void;
  fromSercqSend?: boolean;
}

type SmsItemProps = Omit<SmsElemProps, 'onCancelInsert' | 'fromSercqSend'>;

const SmsContactElem: React.FC<SmsElemProps> = ({
  onCancelInsert,
  slotsProps,
  slots,
  beforeValidationCallback,
  fromSercqSend = false,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { defaultSERCQ_SENDAddress, defaultPECAddress, defaultSMSAddress, addresses } =
    useAppSelector(contactsSelectors.selectAddresses);
  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);
  const digitalContactRef = useRef<{ toggleEdit: () => void; resetForm: () => Promise<void> }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  // currentAddress is needed to store what address we are creating/editing/removing
  // because this variable isn't been used to render, we can use useRef
  const currentAddress = useRef<{ value: string }>({
    value: '',
  });
  const dispatch = useAppDispatch();

  const isDigitalDomicileActive = defaultPECAddress || defaultSERCQ_SENDAddress;

  const currentValue = defaultSMSAddress?.value ?? '';

  const handleSubmit = (value: string) => {
    if (!fromSercqSend) {
      const source = externalEvent?.source ?? ContactSource.RECAPITI;
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_START, {
        senderId: 'default',
        source,
      });
    }
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { value };
    // first check if contact already exists
    if (
      contactAlreadyExists(addresses, internationalPhonePrefix + value, 'default', ChannelType.SMS)
    ) {
      setModalOpen(ModalType.EXISTING);
      return;
    }
    if (!isDigitalDomicileActive && !fromSercqSend) {
      setModalOpen(ModalType.INFORMATIVE);
      return;
    }
    handleCodeVerification();
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      if (fromSercqSend) {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_UX_CONVERSION);
      } else {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_UX_CONVERSION, 'default');
      }
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: 'default',
      channelType: ChannelType.SMS,
      value: internationalPhonePrefix + currentAddress.current.value,
      code: verificationCode,
    };

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        // contact to verify
        // open code modal
        if (!res) {
          // aprire la code modal
          if (fromSercqSend) {
            PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_SMS_OTP);
          }
          setModalOpen(ModalType.CODE);
          return;
        }

        if (fromSercqSend) {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_UX_SUCCESS);
        } else {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_UX_SUCCESS, {
            senderId: 'default',
            fromSercqSend,
          });
        }

        // contact has already been verified
        // show success message
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.sms-added-successfully`, {
              ns: 'recapiti',
            }),
          })
        );
        setModalOpen(null);
        if (currentValue) {
          digitalContactRef.current.toggleEdit();
        }
      })
      .catch(() => {});
  };

  const handleCancelCode = async () => {
    if (fromSercqSend) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_BACK);
    }
    setModalOpen(null);
    if (currentValue) {
      digitalContactRef.current.toggleEdit();
    }
    await digitalContactRef.current.resetForm();
  };

  /*
   * if *some* value (phone number, email address) has been attached to the contact type,
   * then we show the value giving the user the possibility of changing it
   * (the DigitalContact component includes the "update" button)
   * if *no* value (phone number, email address) has been attached to the contact type,
   * then we show the input field allowing the user to enter it along with the button
   * to perform the addition.
   */

  return (
    <>
      <DigitalContact
        label={t(`courtesy-contacts.sms-to-add`, { ns: 'recapiti' })}
        value={currentValue}
        channelType={ChannelType.SMS}
        ref={digitalContactRef}
        inputProps={{
          label: t(`courtesy-contacts.link-sms-placeholder`, {
            ns: 'recapiti',
          }),
          prefix: internationalPhonePrefix,
        }}
        insertButtonLabel={t(`courtesy-contacts.sms-add`, { ns: 'recapiti' })}
        onSubmit={handleSubmit}
        onCancelInsert={onCancelInsert}
        slots={slots}
        slotsProps={slotsProps}
        beforeValidationCallback={beforeValidationCallback}
      />
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={currentAddress.current.value}
        handleDiscard={handleCancelCode}
        handleConfirm={() => handleCodeVerification()}
      />
      <ContactCodeDialog
        value={currentAddress.current.value}
        addressType={AddressType.COURTESY}
        channelType={ChannelType.SMS}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCancelCode}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_CODE_ERROR)}
      />
      <InformativeDialog
        open={modalOpen === ModalType.INFORMATIVE}
        title={t('courtesy-contacts.info-modal-sms-title', { ns: 'recapiti' })}
        subtitle={t('courtesy-contacts.info-modal-sms-subtitle', { ns: 'recapiti' })}
        content={t('courtesy-contacts.info-modal-sms-content', { ns: 'recapiti' })}
        onConfirm={() => {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_SMS_CONTINUE);
          handleCodeVerification();
        }}
        onDiscard={() => {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_SMS_CANCEL);
          setModalOpen(null);
        }}
      />
    </>
  );
};

const SmsContactItem: React.FC<SmsItemProps> = ({
  slotsProps,
  slots,
  beforeValidationCallback,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const {
    defaultSERCQ_SENDAddress,
    defaultPECAddress,
    defaultSMSAddress,
    addresses,
    specialSMSAddresses,
  } = useAppSelector(contactsSelectors.selectAddresses);

  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const [insertMode, setInsertMode] = useState(false);

  const isActive = !!defaultSMSAddress;
  const fromSercqSend = [DIGITAL_DOMICILE_ACTIVATION, DIGITAL_DOMICILE_MANAGEMENT].includes(
    location.pathname
  );
  const blockDelete = specialSMSAddresses.length > 0;

  const hasCourtesyAddresses =
    addresses.filter(
      (addr) => addr.addressType === AddressType.COURTESY && addr.value !== IOAllowedValues.DISABLED
    ).length > 0;

  const showSpecialContactsSection = specialSMSAddresses.length > 0;

  const hasDigitalDomicile = !!defaultSERCQ_SENDAddress || !!defaultPECAddress;

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: ChannelType.SMS,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_SMS_SUCCESS, 'default');
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.sms-removed-successfully`, { ns: 'recapiti' }),
          })
        );
      })
      .catch(() => {});
  };

  const getChipColor = () => {
    if (isActive) {
      return 'success';
    }
    if (defaultSERCQ_SENDAddress && !hasCourtesyAddresses) {
      return 'warning';
    }
    return 'default';
  };

  const getRemoveModalTitle = () => {
    if (blockDelete) {
      return t('courtesy-contacts.block-remove-sms-title', { ns: 'recapiti' });
    }
    if (hasDigitalDomicile) {
      return t(`courtesy-contacts.remove-sms-title-dod-enabled`, {
        ns: 'recapiti',
      });
    }
    return t('courtesy-contacts.remove-sms', { ns: 'recapiti' });
  };

  const getRemoveModalMessage = () => {
    if (blockDelete) {
      return t('courtesy-contacts.block-remove-sms-message', { ns: 'recapiti' });
    }
    if (hasDigitalDomicile) {
      return (
        <Trans
          i18nKey={'courtesy-contacts.remove-sms-message-dod-enabled'}
          ns={'recapiti'}
          components={[
            <Typography variant="body2" fontSize={'18px'} key={'paragraph1'} sx={{ mb: 2 }} />,
            <Typography variant="body2" fontSize={'18px'} key={'paragraph2'} />,
          ]}
        />
      );
    }
    return t('courtesy-contacts.remove-sms-message', {
      value: defaultSMSAddress?.value,
      ns: 'recapiti',
    });
  };

  const handleSetInsertMode = () => {
    if (fromSercqSend) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS);
    }
    setInsertMode(true);
  };

  const handleCancelInsertMode = () => {
    if (fromSercqSend) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_CANCEL);
    }
    setInsertMode(false);
  };

  const getActions = () =>
    isActive
      ? [
          <Button
            data-testid="disable-sms"
            key="disable"
            variant="naked"
            color="error"
            startIcon={<PowerSettingsNewIcon />}
            onClick={() => {
              setModalOpen(ModalType.DELETE);
            }}
            sx={{ p: '10px 16px' }}
          >
            {t('button.disable')}
          </Button>,
        ]
      : undefined;

  if (isActive) {
    return (
      <PnInfoCard
        title={
          <Typography
            variant="h6"
            fontWeight={700}
            fontSize={{ xs: '22px', lg: '24px' }}
            mb={2}
            data-testid="smsContactTitle"
          >
            {t('courtesy-contacts.sms-title', { ns: 'recapiti' })}
          </Typography>
        }
        subtitle={
          <Chip
            label={t(`status.${isActive ? 'active' : 'inactive'}`, { ns: 'recapiti' })}
            color={getChipColor()}
            size="small"
            sx={{ mb: 2 }}
          />
        }
        actions={getActions()}
        expanded={isActive}
        data-testid="smsContact"
      >
        <SmsContactElem slotsProps={slotsProps} />
        <Typography
          mt={2}
          variant="body1"
          fontSize={{ xs: '14px', lg: '18px' }}
          color="text.secondary"
          data-testid="smsContactDescription"
        >
          {t('courtesy-contacts.sms-description', { ns: 'recapiti' })}
        </Typography>
        {showSpecialContactsSection && (
          <SpecialContacts addressType={AddressType.COURTESY} channelType={ChannelType.SMS} />
        )}
        <DeleteDialog
          showModal={modalOpen === ModalType.DELETE}
          removeModalTitle={getRemoveModalTitle()}
          removeModalBody={getRemoveModalMessage()}
          handleModalClose={() => setModalOpen(null)}
          confirmHandler={deleteConfirmHandler}
          slotsProps={{
            primaryButton: {
              onClick: hasDigitalDomicile ? () => setModalOpen(null) : deleteConfirmHandler,
              label: hasDigitalDomicile ? t('button.annulla') : undefined,
            },
            secondaryButton: {
              onClick: hasDigitalDomicile ? deleteConfirmHandler : () => setModalOpen(null),
              label: hasDigitalDomicile
                ? t('courtesy-contacts.remove-sms', { ns: 'recapiti' })
                : undefined,
              ...(hasDigitalDomicile ? { variant: 'outlined', color: 'error' } : {}),
            },
          }}
          blockDelete={blockDelete}
        />
      </PnInfoCard>
    );
  }

  return (
    <Box>
      {insertMode ? (
        <SmsContactElem
          slotsProps={slotsProps}
          slots={slots}
          onCancelInsert={handleCancelInsertMode}
          beforeValidationCallback={beforeValidationCallback}
          fromSercqSend={fromSercqSend}
        />
      ) : (
        <>
          <Typography variant="body1" fontWeight={600} fontSize="16px" mb={1}>
            {t('courtesy-contacts.email-sms-updates', { ns: 'recapiti' })}
          </Typography>
          <ButtonNaked color="primary" sx={{ fontSize: '16px' }} onClick={handleSetInsertMode}>
            {t('courtesy-contacts.email-sms-add', { ns: 'recapiti' })}
          </ButtonNaked>
        </>
      )}
    </Box>
  );
};

export default SmsContactItem;
