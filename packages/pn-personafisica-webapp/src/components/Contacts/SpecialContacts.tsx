import { useFormik } from 'formik';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Alert, Box, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  AppResponse,
  AppResponsePublisher,
  CodeModal,
  CustomDropdown,
  ErrorMessage,
  PnAutocomplete,
  SpecialContactsProvider,
  appStateActions,
  searchStringLimitReachedText,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  DigitalAddress,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { Party } from '../../models/party';
import {
  CONTACT_ACTIONS,
  createOrUpdateAddress,
  getAllActivatedParties,
} from '../../redux/contact/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import {
  allowedAddressTypes,
  contactAlreadyExists,
  emailValidationSchema,
  internationalPhonePrefix,
  pecValidationSchema,
  phoneValidationSchema,
} from '../../utility/contacts.utility';
import DropDownPartyMenuItem from '../Party/DropDownParty';
import AddMoreDigitalContact from './AddMoreDigitalContact';
import DigitalContactsCard from './DigitalContactsCard';
import ExistingContactDialog from './ExistingContactDialog';
import PecVerificationDialog from './PecVerificationDialog';

type Props = {
  digitalAddresses: Array<DigitalAddress>;
  addressType: string;
};

type Addresses = {
  [senderId: string]: Array<DigitalAddress>;
};

type AddressTypeItem = {
  id: ChannelType;
  value: string;
};

enum ModalType {
  EXISTING = 'existing',
  VALIDATION = 'validation',
  CODE = 'code',
}

const SpecialContacts: React.FC<Props> = ({ digitalAddresses, addressType }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const [alreadyExistsMessage, setAlreadyExistsMessage] = useState('');
  const parties = useAppSelector((state: RootState) => state.contactsState.parties);
  // const isMobile = useIsMobile();
  const [senderInputValue, setSenderInputValue] = useState('');
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const codeModalRef =
    useRef<{ updateError: (error: ErrorMessage, codeNotValid: boolean) => void }>(null);

  const addressTypes: Array<AddressTypeItem> = digitalAddresses
    .filter((a) => a.senderId === 'default' && allowedAddressTypes.includes(a.channelType))
    .map((a) => ({
      id: a.channelType,
      value: t(`special-contacts.${a.channelType?.toLowerCase()}`, { ns: 'recapiti' }),
    }));

  const addresses: Addresses = digitalAddresses
    .filter((a) => a.senderId !== 'default')
    .reduce((obj, a) => {
      if (!obj[a.senderId]) {
        // eslint-disable-next-line functional/immutable-data
        obj[a.senderId] = [];
      }
      // eslint-disable-next-line functional/immutable-data
      obj[a.senderId].push(a);
      return obj;
    }, {} as Addresses);

  const fetchAllActivatedParties = useCallback(() => {
    void dispatch(getAllActivatedParties({}));
  }, []);

  const validationSchema = yup.object({
    sender: yup.object({ id: yup.string(), name: yup.string() }).required(),
    addressType: yup.string().required(),
    s_value: yup
      .string()
      .when('addressType', {
        is: ChannelType.PEC,
        then: pecValidationSchema(t),
      })
      .when('addressType', {
        is: ChannelType.EMAIL,
        then: emailValidationSchema(t),
      })
      .when('addressType', {
        is: ChannelType.SMS,
        then: phoneValidationSchema(t),
      }),
  });

  const initialValues = {
    sender: { id: '', name: '' },
    addressType: addressTypes[0]?.id,
    s_value: '',
  };

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const event =
        values.addressType === ChannelType.PEC
          ? PFEventsType.SEND_ADD_PEC_START
          : values.addressType === ChannelType.SMS
          ? PFEventsType.SEND_ADD_SMS_START
          : PFEventsType.SEND_ADD_EMAIL_START;
      PFEventStrategyFactory.triggerEvent(event, values.sender.id);
      // first check if contact already exists
      if (
        contactAlreadyExists(digitalAddresses, values.s_value, values.sender.id, values.addressType)
      ) {
        setModalOpen(ModalType.EXISTING);
        return;
      }
      handleCodeVerification();
    },
  });

  const labelRoot =
    formik.values.addressType === ChannelType.PEC ? 'legal-contacts' : 'courtesy-contacts';
  const contactType = formik.values.addressType?.toLowerCase();

  const renderOption = (props: any, option: Party) => (
    <MenuItem {...props} value={option.id} key={option.id}>
      <DropDownPartyMenuItem name={option.name} />
    </MenuItem>
  );

  const getOptionLabel = (option: Party) => option.name || '';

  // handling of search string for sender
  const entitySearchLabel: string = `${t('special-contacts.sender', {
    ns: 'recapiti',
  })}${searchStringLimitReachedText(senderInputValue)}`;

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const senderChangeHandler = async (_: any, newValue: Party | null) => {
    await formik.setFieldTouched('sender', true, false);
    await formik.setFieldValue('sender', newValue);
    setSenderInputValue(newValue?.name ?? '');
    if (newValue && addresses[newValue.id]) {
      const alreadyExists =
        addresses[newValue.id].findIndex((a) => a.channelType === formik.values.addressType) > -1;
      setAlreadyExistsMessage(
        alreadyExists
          ? t(`special-contacts.${contactType}-already-exists`, {
              ns: 'recapiti',
            })
          : ''
      );
      return;
    }
    setAlreadyExistsMessage('');
  };

  const addressTypeChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    await formik.setFieldValue('s_value', '');
    formik.handleChange(e);
    if (formik.values.sender && addresses[formik.values.sender.id]) {
      const alreadyExists =
        addresses[formik.values.sender.id].findIndex((a) => a.channelType === e.target.value) > -1;
      setAlreadyExistsMessage(
        alreadyExists
          ? t(`special-contacts.${e.target.value?.toLowerCase()}-already-exists`, {
              ns: 'recapiti',
            })
          : ''
      );
      return;
    }
    setAlreadyExistsMessage('');
  };

  const sendSuccessEvent = (type: ChannelType) => {
    const event =
      type === ChannelType.PEC
        ? PFEventsType.SEND_ADD_PEC_UX_SUCCESS
        : type === ChannelType.SMS
        ? PFEventsType.SEND_ADD_SMS_UX_SUCCESS
        : PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS;
    PFEventStrategyFactory.triggerEvent(event, formik.values.sender.id);
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      const event =
        formik.values.addressType === ChannelType.PEC
          ? PFEventsType.SEND_ADD_PEC_UX_CONVERSION
          : formik.values.addressType === ChannelType.SMS
          ? PFEventsType.SEND_ADD_SMS_UX_CONVERSION
          : PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION;
      PFEventStrategyFactory.triggerEvent(event, formik.values.sender.id);
    }

    const addressType =
      formik.values.addressType === ChannelType.PEC ? AddressType.LEGAL : AddressType.COURTESY;
    const value =
      formik.values.addressType === ChannelType.SMS
        ? internationalPhonePrefix + formik.values.s_value
        : formik.values.s_value;
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType,
      senderId: formik.values.sender.id,
      senderName: formik.values.sender.name,
      channelType: formik.values.addressType,
      value,
      code: verificationCode,
    };

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then(async (res) => {
        // contact to verify
        // open code modal
        if (!res) {
          setModalOpen(ModalType.CODE);
          return;
        }

        sendSuccessEvent(formik.values.addressType);

        // contact has already been verified
        if (res.pecValid || formik.values.addressType !== ChannelType.PEC) {
          // show success message
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t(`${labelRoot}.${contactType}-added-successfully`, {
                ns: 'recapiti',
              }),
            })
          );
          setModalOpen(null);
          // reset form
          formik.resetForm();
          await formik.validateForm();
          setSenderInputValue('');
          return;
        }
        // contact must be validated
        // open validation modal
        setModalOpen(ModalType.VALIDATION);
      })
      .catch(() => {});
  };

  const handleAddressUpdateError = useCallback(
    (responseError: AppResponse) => {
      if (modalOpen === null) {
        // notify the publisher we are not handling the error
        return true;
      }
      if (Array.isArray(responseError.errors)) {
        const error = responseError.errors[0];
        codeModalRef.current?.updateError(
          {
            title: error.message.title,
            content: error.message.content,
          },
          true
        );
        if (formik.values.addressType === ChannelType.PEC) {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_CODE_ERROR);
        } else if (formik.values.addressType === ChannelType.SMS) {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_CODE_ERROR);
        } else if (formik.values.addressType === ChannelType.EMAIL) {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_CODE_ERROR);
        }
      }
      return false;
    },
    [modalOpen]
  );

  useEffect(() => {
    AppResponsePublisher.error.subscribe('createOrUpdateAddress', handleAddressUpdateError);

    return () => {
      AppResponsePublisher.error.unsubscribe('createOrUpdateAddress', handleAddressUpdateError);
    };
  }, [handleAddressUpdateError]);

  useEffect(() => {
    if (senderInputValue.length >= 4) {
      void dispatch(getAllActivatedParties({ paNameFilter: senderInputValue, blockLoading: true }));
    } else if (senderInputValue.length === 0) {
      void dispatch(getAllActivatedParties({ blockLoading: true }));
    }
  }, [senderInputValue]);

  return (
    <ApiErrorWrapper
      apiId={CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES}
      reloadAction={fetchAllActivatedParties}
      mainText={t('special-contacts.fetch-party-error', { ns: 'recapiti' })}
    >
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={formik.values.s_value}
        handleDiscard={() => setModalOpen(null)}
        handleConfirm={() => handleCodeVerification()}
      />
      <CodeModal
        title={
          t(`${labelRoot}.${contactType}-verify`, { ns: 'recapiti' }) + ` ${formik.values.s_value}`
        }
        subtitle={<Trans i18nKey={`${labelRoot}.${contactType}-verify-descr`} ns="recapiti" />}
        open={modalOpen === ModalType.CODE}
        initialValues={new Array(5).fill('')}
        codeSectionTitle={t(`${labelRoot}.insert-code`, { ns: 'recapiti' })}
        codeSectionAdditional={
          <>
            <Typography variant="body2" display="inline">
              {t(`${labelRoot}.${contactType}-new-code`, { ns: 'recapiti' })}
              &nbsp;
            </Typography>
            <ButtonNaked
              component={Box}
              onClick={() => handleCodeVerification()}
              sx={{ verticalAlign: 'unset', display: 'inline' }}
            >
              <Typography
                display="inline"
                color="primary"
                variant="body2"
                sx={{ textDecoration: 'underline' }}
              >
                {t(`${labelRoot}.new-code-link`, { ns: 'recapiti' })}.
              </Typography>
            </ButtonNaked>
          </>
        }
        cancelLabel={t('button.annulla')}
        confirmLabel={t('button.conferma')}
        cancelCallback={() => setModalOpen(null)}
        confirmCallback={(values: Array<string>) => handleCodeVerification(values.join(''))}
        ref={codeModalRef}
      />
      <PecVerificationDialog
        open={modalOpen === ModalType.VALIDATION}
        handleConfirm={() => setModalOpen(null)}
      />
      <AddMoreDigitalContact addressType={addressType} />
    </ApiErrorWrapper>
  );
};

export default SpecialContacts;
