import { useFormik } from 'formik';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
import {
  AppResponse,
  AppResponsePublisher,
  ErrorMessage,
  PnAutocomplete,
  PnDialog,
  PnDialogActions,
  PnDialogContent,
  searchStringLimitReachedText,
} from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { ChannelType, DigitalAddress } from '../../models/contacts';
import { Party } from '../../models/party';
import { getAllActivatedParties } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import {
  allowedAddressTypes,
  contactAlreadyExists,
  emailValidationSchema,
  pecValidationSchema,
  phoneValidationSchema,
} from '../../utility/contacts.utility';
import DropDownPartyMenuItem from '../Party/DropDownParty';

type Props = {
  open: boolean;
  senderId?: string;
  handleClose: () => void;
  handleConfirm: () => void;
  digitalAddresses: Array<DigitalAddress>;
  channelType: ChannelType;
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
  SPECIAL = 'special',
}

const AddSpecialContactDialog: React.FC<Props> = ({
  open,
  handleClose,
  handleConfirm,
  digitalAddresses,
  channelType,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const getOptionLabel = (option: Party) => option.name || '';
  const [senderInputValue, setSenderInputValue] = useState('');
  const [alreadyExistsMessage, setAlreadyExistsMessage] = useState('');
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const codeModalRef =
    useRef<{ updateError: (error: ErrorMessage, codeNotValid: boolean) => void }>(null);

  const parties = useAppSelector((state: RootState) => state.contactsState.parties);

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

  // handling of search string for sender
  const entitySearchLabel: string = `${t('special-contacts.add-sender', {
    ns: 'recapiti',
  })}${searchStringLimitReachedText(senderInputValue)}`;

  const renderOption = (props: any, option: Party) => (
    <MenuItem {...props} value={option.id} key={option.id}>
      <DropDownPartyMenuItem name={option.name} />
    </MenuItem>
  );

  const addressTypes: Array<AddressTypeItem> = digitalAddresses
    .filter((a) => a.senderId === 'default' && allowedAddressTypes.includes(a.channelType))
    .map((a) => ({
      id: a.channelType,
      value: t(`special-contacts.${a.channelType?.toLowerCase()}`, { ns: 'recapiti' }),
    }));

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
      handleConfirm();
    },
  });

  const contactType = formik.values.addressType.toLowerCase();

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
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
    <PnDialog open={open} onClose={handleClose} data-testid="cancelVerificationModal">
      <DialogTitle id="dialog-title">
        {t('special-contacts.modal-title', { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <Typography variant="caption-semibold">
          {t(`special-contacts.${channelType.toLowerCase()}`, { ns: 'recapiti' })}
        </Typography>
        <Stack mt={1} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            inputProps={{ sx: { height: '14px' } }}
            fullWidth
            {...{
              id: `s_value`,
              name: `s_value`,
              placeholder: t(`special-contacts.link-${channelType.toLowerCase()}-placeholder`, {
                ns: 'recapiti',
              }),
              value: formik.values[`s_value`],
              onChange: handleChangeTouched,
              error: formik.touched[`s_value`] && Boolean(formik.errors[`s_value`]),
              helperText: formik.touched[`s_value`] && formik.errors[`s_value`],
            }}
          />
        </Stack>
        <Stack my={2}>
          <Typography variant="caption-semibold" mb={1}>
            {t(`special-contacts.senders-to-add`, { ns: 'recapiti' })}
          </Typography>
          <Typography variant="caption" mb={2}>
            {t(`special-contacts.senders-caption`, { ns: 'recapiti' })}
          </Typography>
          <PnAutocomplete
            id="sender"
            data-testid="sender"
            size="small"
            options={parties ?? []}
            autoComplete
            getOptionLabel={getOptionLabel}
            noOptionsText={t('common.enti-not-found', { ns: 'recapiti' })}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={senderChangeHandler}
            inputValue={senderInputValue}
            onInputChange={(_event, newInputValue, reason) => {
              if (reason === 'input') {
                setSenderInputValue(newInputValue);
              }
            }}
            filterOptions={(e) => e}
            renderOption={renderOption}
            renderInput={(params) => (
              <TextField
                {...params}
                name="sender"
                label={entitySearchLabel}
                error={senderInputValue.length > 80}
                helperText={
                  senderInputValue.length > 80 && t('too-long-field-error', { maxLength: 80 })
                }
              />
            )}
            sx={{ flexGrow: 1, flexBasis: 0 }}
          />
        </Stack>
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={handleClose} variant="outlined">
          {t('button.annulla')}
        </Button>
        <Button onClick={handleConfirm} variant="contained">
          {t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default AddSpecialContactDialog;
