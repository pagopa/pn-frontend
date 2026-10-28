import { JSXElementConstructor, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextFieldProps,
  Typography,
  TypographyProps,
} from '@mui/material';
import { EventAction, PnInfoCard, appStateActions } from '@pagopa-pn/pn-commons';
import { MIButton, MIButtonProps, MIChip } from '@pagopa/mui-italia';

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
import { getConfiguration } from '../../services/configuration.service';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import {
  contactAlreadyExists,
  getDefaultMobileAddress,
  internationalPhonePrefix,
} from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import DeleteDialog from './DeleteDialog';
import DigitalContact from './DigitalContact';
import ExistingContactDialog from './ExistingContactDialog';
import SpecialContacts from './SpecialContacts';

enum ModalType {
  EXISTING = 'existing',
  CODE = 'code',
  DELETE = 'delete',
  INFORMATIVE = 'informative',
}

/** SMS e WhatsApp sono i due canali possibili per il numero di cellulare (in alternativa). */
type MobileChannel = ChannelType.SMS | ChannelType.WHATSAPP;

const otherMobileChannel = (channel: MobileChannel): MobileChannel =>
  channel === ChannelType.SMS ? ChannelType.WHATSAPP : ChannelType.SMS;

/**
 * Gli eventi Mixpanel esistenti descrivono il canale SMS: per WhatsApp non vengono inviati
 * finché non saranno definiti eventi dedicati (vedi PR WhatsApp, follow-up analytics).
 */
const trackSmsEvent = (channel: MobileChannel, track: () => void) => {
  if (channel === ChannelType.SMS) {
    track();
  }
};

const isWhatsappEnabled = () => !!getConfiguration().IS_WHATSAPP_ENABLED;

interface SmsSlots {
  label?: JSXElementConstructor<TypographyProps>;
}

interface SmsSlotsProps {
  textField?: Partial<TextFieldProps>;
  button?: Partial<MIButtonProps>;
}

interface SmsElemProps {
  slots?: SmsSlots;
  slotsProps?: SmsSlotsProps;
  beforeValidationCallback?: (value: string, errors?: string) => void;
  onCancelInsert?: () => void;
  inSERCQWizardContext?: boolean;
}

type SmsItemProps = Omit<SmsElemProps, 'onCancelInsert' | 'inSERCQWizardContext'>;

interface MobileChannelSelectorProps {
  value: MobileChannel;
  onChange: (channel: MobileChannel) => void;
}

const MobileChannelSelector: React.FC<MobileChannelSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation(['recapiti']);
  return (
    <FormControl sx={{ mb: 2 }} data-testid="mobileChannelSelector">
      <FormLabel id="mobile-channel-label" sx={{ fontWeight: 600, fontSize: '16px' }}>
        {t('courtesy-contacts.mobile-channel-question', { ns: 'recapiti' })}
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="mobile-channel-label"
        name="mobile-channel"
        value={value}
        onChange={(event) => onChange(event.target.value as MobileChannel)}
      >
        <FormControlLabel
          value={ChannelType.SMS}
          control={<Radio data-testid="mobileChannel-SMS" />}
          label={t('courtesy-contacts.mobile-channel-sms', { ns: 'recapiti' })}
        />
        <FormControlLabel
          value={ChannelType.WHATSAPP}
          control={<Radio data-testid="mobileChannel-WHATSAPP" />}
          label={t('courtesy-contacts.mobile-channel-whatsapp', { ns: 'recapiti' })}
        />
      </RadioGroup>
      <Typography variant="caption" color="text.secondary">
        {t('courtesy-contacts.mobile-channel-hint', { ns: 'recapiti' })}
      </Typography>
    </FormControl>
  );
};

const SmsContactElem: React.FC<SmsElemProps> = ({
  onCancelInsert,
  slotsProps,
  slots,
  beforeValidationCallback,
  inSERCQWizardContext = false,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const selectedAddresses = useAppSelector(contactsSelectors.selectAddresses);
  const { addresses } = selectedAddresses;
  const { address: defaultMobileAddress, channelType: activeChannel } =
    getDefaultMobileAddress(selectedAddresses);
  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);
  const digitalContactRef = useRef<{ toggleEdit: () => void; resetForm: () => Promise<void> }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  // nel wizard SERCQ il numero è sempre un recapito SMS
  const canChooseChannel = isWhatsappEnabled() && !inSERCQWizardContext;
  const [selectedChannel, setSelectedChannel] = useState<MobileChannel>(activeChannel);
  // currentAddress is needed to store what address we are creating/editing/removing
  // because this variable isn't been used to render, we can use useRef
  const currentAddress = useRef<{ value: string }>({
    value: '',
  });
  const dispatch = useAppDispatch();

  const currentValue = defaultMobileAddress?.value ?? '';
  // in modifica il canale resta quello attivo; il cambio canale si fa con "Passa a ..."
  const channel: MobileChannel = currentValue ? activeChannel : selectedChannel;

  const handleSubmit = (value: string) => {
    if (!inSERCQWizardContext && !defaultMobileAddress) {
      const source = externalEvent?.source ?? ContactSource.RECAPITI;
      trackSmsEvent(channel, () =>
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_START, {
          senderId: 'default',
          source,
        })
      );
    }
    // eslint-disable-next-line functional/immutable-data
    currentAddress.current = { value };
    // first check if contact already exists
    if (contactAlreadyExists(addresses, internationalPhonePrefix + value, 'default', channel)) {
      setModalOpen(ModalType.EXISTING);
      return;
    }
    handleCodeVerification();
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      if (inSERCQWizardContext) {
        trackSmsEvent(channel, () =>
          PFEventStrategyFactory.triggerEvent(
            PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_UX_CONVERSION
          )
        );
      } else if (defaultMobileAddress) {
        trackSmsEvent(channel, () =>
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_CHANGE_SMS_UX_CONVERSION)
        );
      } else {
        trackSmsEvent(channel, () =>
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_UX_CONVERSION, 'default')
        );
      }
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: 'default',
      channelType: channel,
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
          if (inSERCQWizardContext) {
            trackSmsEvent(channel, () =>
              PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_SMS_OTP)
            );
          } else if (defaultMobileAddress) {
            trackSmsEvent(channel, () =>
              PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_CHANGE_SMS_OTP)
            );
          } else {
            trackSmsEvent(channel, () =>
              PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_OTP)
            );
          }

          setModalOpen(ModalType.CODE);
          return;
        }

        if (inSERCQWizardContext) {
          trackSmsEvent(channel, () =>
            PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_UX_SUCCESS)
          );
        } else if (defaultMobileAddress) {
          trackSmsEvent(channel, () =>
            PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_CHANGE_SMS_UX_SUCCESS)
          );
        } else {
          trackSmsEvent(channel, () =>
            PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_UX_SUCCESS, {
              senderId: 'default',
              fromSercqSend: inSERCQWizardContext,
            })
          );
        }

        // contact has already been verified
        // show success message
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(
              channel === ChannelType.WHATSAPP
                ? `courtesy-contacts.whatsapp-added-successfully`
                : `courtesy-contacts.sms-added-successfully`,
              {
                ns: 'recapiti',
              }
            ),
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
    if (inSERCQWizardContext) {
      trackSmsEvent(channel, () =>
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_BACK)
      );
    } else if (defaultMobileAddress) {
      trackSmsEvent(channel, () =>
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_CHANGE_SMS_BACK)
      );
    } else {
      trackSmsEvent(channel, () =>
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_BACK)
      );
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
      {canChooseChannel && !currentValue && (
        <MobileChannelSelector value={selectedChannel} onChange={setSelectedChannel} />
      )}
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
        onEditButtonClickCallback={() =>
          trackSmsEvent(channel, () =>
            PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_CHANGE_SMS_START)
          )
        }
        onEditCancelCallback={() =>
          trackSmsEvent(channel, () =>
            PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_CHANGE_SMS_CANCEL)
          )
        }
        onEditConfirmCallback={() =>
          trackSmsEvent(channel, () =>
            PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_CHANGE_SMS_CONTINUE)
          )
        }
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
        channelType={channel}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCancelCode}
        onError={() =>
          trackSmsEvent(channel, () =>
            PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_CODE_ERROR)
          )
        }
      />
    </>
  );
};

/**
 * Passaggio del numero già attivo da un canale all'altro (SMS <-> WhatsApp).
 * Richiede la verifica OTP sul nuovo canale; a verifica completata il backend elimina il recapito
 * sul canale precedente (mutua esclusione).
 */
const SwitchMobileChannel: React.FC<{
  value: string;
  fromChannel: MobileChannel;
  open: boolean;
  onClose: () => void;
}> = ({ value, fromChannel, open, onClose }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const toChannel = otherMobileChannel(fromChannel);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const number = value.replace(internationalPhonePrefix, '');

  const save = (verificationCode?: string) => {
    dispatch(
      createOrUpdateAddress({
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: toChannel,
        value,
        code: verificationCode,
      })
    )
      .unwrap()
      .then((res) => {
        if (!res) {
          setCodeModalOpen(true);
          return;
        }
        setCodeModalOpen(false);
        onClose();
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.mobile-channel-switched-${toChannel.toLowerCase()}`, {
              ns: 'recapiti',
            }),
          })
        );
      })
      .catch(() => {});
  };

  return (
    <>
      <DeleteDialog
        showModal={open && !codeModalOpen}
        removeModalTitle={t(
          `courtesy-contacts.mobile-channel-switch-title-${toChannel.toLowerCase()}`,
          {
            ns: 'recapiti',
          }
        )}
        removeModalBody={t(
          `courtesy-contacts.mobile-channel-switch-message-${toChannel.toLowerCase()}`,
          {
            ns: 'recapiti',
            value,
          }
        )}
        handleModalClose={onClose}
        confirmHandler={() => save()}
        slotsProps={{
          primaryButton: {
            onClick: () => save(),
            label: t('button.conferma'),
          },
          secondaryButton: {
            onClick: onClose,
            label: t('button.annulla'),
          },
        }}
      />
      <ContactCodeDialog
        value={number}
        addressType={AddressType.COURTESY}
        channelType={toChannel}
        open={codeModalOpen}
        onConfirm={(code) => save(code)}
        onDiscard={() => {
          setCodeModalOpen(false);
          onClose();
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
  const selectedAddresses = useAppSelector(contactsSelectors.selectAddresses);
  const {
    defaultSERCQ_SENDAddress,
    defaultPECAddress,
    addresses,
    specialSMSAddresses,
    legalAddresses,
  } = selectedAddresses;
  const { address: defaultMobileAddress, channelType: activeChannel } =
    getDefaultMobileAddress(selectedAddresses);
  const isWhatsapp = activeChannel === ChannelType.WHATSAPP;

  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [insertMode, setInsertMode] = useState(false);

  const isActive = !!defaultMobileAddress;
  const inSERCQWizardContext = [DIGITAL_DOMICILE_ACTIVATION, DIGITAL_DOMICILE_MANAGEMENT].includes(
    location.pathname
  );
  const blockDelete = specialSMSAddresses.length > 0;

  const hasCourtesyAddresses =
    addresses.filter(
      (addr) => addr.addressType === AddressType.COURTESY && addr.value !== IOAllowedValues.DISABLED
    ).length > 0;

  const showSpecialContactsSection = specialSMSAddresses.length > 0;

  const hasDigitalDomicile = !!defaultSERCQ_SENDAddress || !!defaultPECAddress;

  // chiave i18n del canale attivo: i testi WhatsApp sono separati da quelli SMS
  const channelKey = isWhatsapp ? 'whatsapp' : 'sms';

  const deleteConfirmHandler = () => {
    if (!inSERCQWizardContext) {
      trackSmsEvent(activeChannel, () =>
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_SMS_POP_UP_CONTINUE, {
          event_type: EventAction.ACTION,
          legal_addresses: legalAddresses,
        })
      );
    }

    setModalOpen(null);
    dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: activeChannel,
      })
    )
      .unwrap()
      .then(() => {
        trackSmsEvent(activeChannel, () =>
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_SMS_SUCCESS, 'default')
        );
        if (!inSERCQWizardContext) {
          trackSmsEvent(activeChannel, () =>
            PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_SMS_POP_UP_UX_SUCCESS, {
              event_type: EventAction.SCREEN_VIEW,
              legal_addresses: legalAddresses,
            })
          );
        }
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`courtesy-contacts.${channelKey}-removed-successfully`, { ns: 'recapiti' }),
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
    return 'neutral';
  };

  const getRemoveModalTitle = () => {
    if (blockDelete) {
      return t('courtesy-contacts.block-remove-sms-title', { ns: 'recapiti' });
    }
    if (hasDigitalDomicile) {
      return t(`courtesy-contacts.remove-${channelKey}-title-dod-enabled`, {
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
          i18nKey={`courtesy-contacts.remove-${channelKey}-message-dod-enabled`}
          ns={'recapiti'}
          components={[
            <Typography variant="body2" fontSize={'18px'} key={'paragraph1'} sx={{ mb: 2 }} />,
            <Typography variant="body2" fontSize={'18px'} key={'paragraph2'} />,
          ]}
        />
      );
    }
    return t(`courtesy-contacts.remove-${channelKey}-message`, {
      value: defaultMobileAddress?.value,
      ns: 'recapiti',
    });
  };

  const handleSetInsertMode = () => {
    if (inSERCQWizardContext) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS);
    }
    setInsertMode(true);
  };

  const handleCancelInsertMode = () => {
    if (inSERCQWizardContext) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_CANCEL);
    }
    setInsertMode(false);
  };

  const handleDisableSms = () => {
    if (!inSERCQWizardContext) {
      trackSmsEvent(activeChannel, () =>
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_SMS_START, {
          event_type: EventAction.ACTION,
          legal_addresses: legalAddresses,
        })
      );

      trackSmsEvent(activeChannel, () =>
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_SMS_POP_UP, {
          event_type: EventAction.SCREEN_VIEW,
          legal_addresses: legalAddresses,
        })
      );
    }

    setModalOpen(ModalType.DELETE);
  };

  const handleCloseDeleteDialog = () => {
    if (!inSERCQWizardContext) {
      trackSmsEvent(activeChannel, () =>
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_SMS_POP_UP_CANCEL, {
          event_type: EventAction.ACTION,
          legal_addresses: legalAddresses,
        })
      );
    }

    setModalOpen(null);
  };

  const getActions = () => {
    if (!isActive) {
      return undefined;
    }
    const switchAction =
      isWhatsappEnabled() && !inSERCQWizardContext
        ? [
            {
              key: 'switchChannel',
              label: t(
                `courtesy-contacts.mobile-channel-switch-to-${isWhatsapp ? 'sms' : 'whatsapp'}`,
                {
                  ns: 'recapiti',
                }
              ),
              icon: <SwapHorizRoundedIcon />,
              testId: 'switch-mobile-channel',
              onClick: () => setSwitchOpen(true),
            },
          ]
        : [];
    return [
      ...switchAction,
      {
        key: 'disable',
        label: t('button.disable'),
        icon: <PowerSettingsNewRoundedIcon />,
        destructive: true,
        testId: 'disable-sms',
        onClick: handleDisableSms,
      },
    ];
  };

  if (isActive) {
    return (
      <PnInfoCard
        title={
          <Typography
            component="span"
            display="block"
            variant="h6"
            fontWeight={700}
            fontSize={{ xs: '22px', lg: '24px' }}
            mb={2}
            data-testid="smsContactTitle"
          >
            {t(`courtesy-contacts.${channelKey}-title`, { ns: 'recapiti' })}
          </Typography>
        }
        subtitle={
          <MIChip
            label={t(`status.${isActive ? 'active' : 'inactive'}`, { ns: 'recapiti' })}
            color={getChipColor()}
            sx={{ mb: 2 }}
          />
        }
        actions={getActions()}
        data-testid="smsContact"
      >
        <SmsContactElem slotsProps={slotsProps} />
        <Typography
          mt={2}
          variant="body1"
          fontSize={{ xs: '14px', lg: '16px' }}
          data-testid="smsContactDescription"
        >
          {t(`courtesy-contacts.${channelKey}-description`, { ns: 'recapiti' })}
        </Typography>
        {showSpecialContactsSection && (
          <SpecialContacts addressType={AddressType.COURTESY} channelType={ChannelType.SMS} />
        )}
        <DeleteDialog
          showModal={modalOpen === ModalType.DELETE}
          removeModalTitle={getRemoveModalTitle()}
          removeModalBody={getRemoveModalMessage()}
          handleModalClose={handleCloseDeleteDialog}
          confirmHandler={deleteConfirmHandler}
          slotsProps={{
            primaryButton: {
              onClick: hasDigitalDomicile ? handleCloseDeleteDialog : deleteConfirmHandler,
              label: hasDigitalDomicile ? t('button.annulla') : undefined,
            },
            secondaryButton: {
              onClick: hasDigitalDomicile ? deleteConfirmHandler : handleCloseDeleteDialog,
              label: hasDigitalDomicile
                ? t(`courtesy-contacts.remove-${channelKey}`, { ns: 'recapiti' })
                : undefined,
              ...(hasDigitalDomicile ? { variant: 'outlined', color: 'error' } : {}),
            },
          }}
          blockDelete={blockDelete}
        />
        {defaultMobileAddress && (
          <SwitchMobileChannel
            value={defaultMobileAddress.value}
            fromChannel={activeChannel}
            open={switchOpen}
            onClose={() => setSwitchOpen(false)}
          />
        )}
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
          inSERCQWizardContext={inSERCQWizardContext}
        />
      ) : (
        <>
          <Typography variant="body1" fontWeight={600} fontSize="16px" mb={1}>
            {t(
              isWhatsappEnabled() && !inSERCQWizardContext
                ? 'courtesy-contacts.email-mobile-updates'
                : 'courtesy-contacts.email-sms-updates',
              { ns: 'recapiti' }
            )}
          </Typography>
          <MIButton variant="text" sx={{ fontSize: '16px' }} onClick={handleSetInsertMode}>
            {t('courtesy-contacts.email-sms-add', { ns: 'recapiti' })}
          </MIButton>
        </>
      )}
    </Box>
  );
};

export default SmsContactItem;
