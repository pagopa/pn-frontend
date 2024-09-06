import { useFormik } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  Alert,
  Button,
  Chip,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ApiErrorWrapper,
  CustomDropdown,
  PnAutocomplete,
  PnDialog,
  PnDialogActions,
  PnDialogContent,
  searchStringLimitReachedText,
} from '@pagopa-pn/pn-commons';

import { ChannelType } from '../../models/contacts';
import { Party } from '../../models/party';
import { CONTACT_ACTIONS, getAllActivatedParties } from '../../redux/contact/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import {
  allowedAddressTypes,
  emailValidationSchema,
  internationalPhonePrefix,
  pecValidationSchema,
  phoneValidationSchema,
} from '../../utility/contacts.utility';
import DropDownPartyMenuItem from '../Party/DropDownParty';
import { SpecialAddress } from './SpecialContacts';

type Props = {
  open: boolean;
  value: string;
  senders: Array<Party>;
  onDiscard: () => void;
  onConfirm: (value: string, addressType: ChannelType, senders: Array<Party>) => void;
  digitalAddresses: Array<SpecialAddress>;
  channelType?: ChannelType;
};

type AddressTypeItem = {
  id: ChannelType;
  value: string;
  disabled: boolean;
};

const AddSpecialContactDialog: React.FC<Props> = ({
  open,
  value,
  senders,
  onDiscard,
  onConfirm,
  digitalAddresses,
  channelType,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const getOptionLabel = (option: Party) => option.name || '';
  const [senderInputValue, setSenderInputValue] = useState('');
  const [alreadyExistsMessage, setAlreadyExistsMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const parties = useAppSelector((state: RootState) => state.contactsState.parties);

  const addressTypes: Array<AddressTypeItem> = allowedAddressTypes.map((addressType) => ({
    id: addressType,
    value: t(`special-contacts.${addressType.toLowerCase()}`, { ns: 'recapiti' }),
    disabled: !digitalAddresses
      .filter((a) => a.channelType === addressType)
      .some((a) => a.senders.some((s) => s.senderId === 'default')),
  }));

  const addressTypeChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    await formik.setFieldValue('s_value', '');
    formik.handleChange(e);
    checkIfHasDefaultAddress(e.target.value as ChannelType);
    checkIfSenderIsAlreadyAdded(formik.values.senders, e.target.value as ChannelType);
  };

  /**
   * Used to check if the senders has already a contact with the same address type
   * @param senders Array of senders to check
   * @param channelType ChannelType to check
   */
  const checkIfSenderIsAlreadyAdded = (senders: Array<Party>, channelType: ChannelType) => {
    const alreadyExists = digitalAddresses
      .filter((a) => a.channelType === channelType)
      .some((a) => a.senders.some((s) => senders.some((sender) => sender.id === s.senderId)));

    if (alreadyExists) {
      setAlreadyExistsMessage(
        t(`special-contacts.contact-already-exists`, {
          ns: 'recapiti',
        })
      );
      return;
    }
    setAlreadyExistsMessage('');
  };

  /**
   * Used to check if the address type has a default address
   * @param addressType ChannelType to check
   */
  const checkIfHasDefaultAddress = (channelType: ChannelType) => {
    const hasDefaultAddress = digitalAddresses
      .filter((a) => a.channelType === channelType)
      .some((a) => a.senders.some((s) => s.senderId === 'default'));

    if (!hasDefaultAddress) {
      return setErrorMessages(t('special-contacts.no-default-address', { ns: 'recapiti' }));
    }

    return setErrorMessages(null);
  };

  const senderChangeHandler = async (_: any, newValue: Party | null) => {
    setSenderInputValue('');
    if (newValue) {
      const senders = [...formik.values.senders, newValue];
      await formik.setFieldValue('senders', senders);
      checkIfSenderIsAlreadyAdded(senders, formik.values.channelType);
      return;
    }
    checkIfSenderIsAlreadyAdded(formik.values.senders, formik.values.channelType);
  };

  // handling of search string for sender
  const entitySearchLabel: string = `${t('special-contacts.add-sender', {
    ns: 'recapiti',
  })}${searchStringLimitReachedText(senderInputValue)}`;

  const renderOption = (props: any, option: Party) => (
    <MenuItem
      {...props}
      value={option.id}
      key={option.id}
      disabled={formik.values.senders.findIndex((sender) => sender.id === option.id) > -1}
    >
      <DropDownPartyMenuItem name={option.name} />
    </MenuItem>
  );

  const validationSchema = yup.object({
    senders: yup
      .array()
      .of(yup.object({ id: yup.string(), name: yup.string() }).required())
      .min(1),
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
    senders,
    channelType: channelType ?? addressTypes.filter((a) => !a.disabled)[0].id,
    s_value: channelType === ChannelType.SMS ? value.replace(internationalPhonePrefix, '') : value,
  };

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onConfirm(values.s_value, values.channelType, values.senders);
    },
  });

  const handleChangeTouched = async (e: ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleSenderDelete = async (sender: Party) => {
    const senders = formik.values.senders.filter((s) => s.id !== sender.id);
    await formik.setFieldValue('senders', senders);
    checkIfSenderIsAlreadyAdded(senders, formik.values.channelType);
  };

  const getParties = () => {
    if (senderInputValue.length >= 4) {
      void dispatch(getAllActivatedParties({ paNameFilter: senderInputValue, blockLoading: true }));
    } else if (senderInputValue.length === 0) {
      void dispatch(getAllActivatedParties({ blockLoading: true }));
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    getParties();
  }, [senderInputValue, open]);

  useEffect(() => {
    open && checkIfHasDefaultAddress(channelType ?? formik.values.channelType);
  }, [open]);

  const handleClose = () => {
    formik.resetForm({ values: initialValues });
    setAlreadyExistsMessage('');
    setErrorMessages(null);
    onDiscard();
  };

  const handleConfirm = async () => {
    await formik.submitForm();
    formik.resetForm({ values: initialValues });
  };

  return (
    <PnDialog open={open} onClose={handleClose} data-testid="addSpecialContactDialog">
      <DialogTitle id="dialog-title">
        {t(`special-contacts.modal-title`, { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Stack mt={1} direction="column">
            <Typography variant="caption-semibold" mb={1}>
              {t(`special-contacts.contact-to-add`, { ns: 'recapiti' })}
            </Typography>
            <Typography variant="body1" mb={2}>
              {t(`special-contacts.contact-to-add-description`, { ns: 'recapiti' })}
            </Typography>
            <CustomDropdown
              id="addressType"
              name="addressType"
              value={formik.values.channelType}
              onChange={addressTypeChangeHandler}
              size="small"
              sx={{ flexGrow: 1, flexBasis: 0, mb: 2 }}
            >
              {addressTypes.map((a) => (
                <MenuItem
                  id={`dropdown-${a.id}`}
                  key={a.id}
                  value={a.id}
                  disabled={a.disabled}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                >
                  {a.value}
                  {a.disabled && (
                    <Typography fontSize="14px">
                      {t('special-contacts.no-default-address', { ns: 'recapiti' })}
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </CustomDropdown>
            <TextField
              inputProps={{ sx: { height: '14px' } }}
              fullWidth
              id="s_value"
              name="s_value"
              label={t(
                `special-contacts.link-${formik.values.channelType.toLowerCase()}-placeholder`,
                {
                  ns: 'recapiti',
                }
              )}
              placeholder={t(
                `special-contacts.link-${formik.values.channelType.toLowerCase()}-placeholder`,
                {
                  ns: 'recapiti',
                }
              )}
              value={formik.values.s_value}
              onChange={handleChangeTouched}
              error={formik.touched.s_value && Boolean(formik.errors.s_value)}
              helperText={formik.touched.s_value && formik.errors.s_value}
              InputProps={{
                startAdornment:
                  formik.values.channelType === ChannelType.SMS ? (
                    <InputAdornment position="start">{internationalPhonePrefix}</InputAdornment>
                  ) : null,
              }}
            />
          </Stack>

          <Stack my={2}>
            <Typography variant="caption-semibold" mb={1}>
              {t(`special-contacts.senders`, { ns: 'recapiti' })}
            </Typography>
            <ApiErrorWrapper
              apiId={CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES}
              mainText={t('special-contacts.fetch-party-error', { ns: 'recapiti' })}
              reloadAction={getParties}
            >
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
            </ApiErrorWrapper>
          </Stack>

          {formik.values.senders.map((sender) => (
            <Chip
              data-testid="sender_chip"
              variant="outlined"
              key={`${sender.id}_chip`}
              label={sender.name}
              onDelete={() => handleSenderDelete(sender)}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </form>
        {alreadyExistsMessage && (
          <Alert
            severity="warning"
            sx={{ marginBottom: '20px', mt: 2 }}
            data-testid="alreadyExistsAlert"
          >
            {alreadyExistsMessage}
          </Alert>
        )}
        {errorMessages && (
          <Alert severity="info" sx={{ marginBottom: '20px', mt: 2 }} data-testid="errorAlert">
            {errorMessages}
          </Alert>
        )}
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={handleClose} variant="outlined">
          {t('button.annulla')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!formik.isValid || !!errorMessages}
        >
          {t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default AddSpecialContactDialog;
