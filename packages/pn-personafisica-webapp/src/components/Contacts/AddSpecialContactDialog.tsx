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
  PnAutocomplete,
  PnDialog,
  PnDialogActions,
  PnDialogContent,
  searchStringLimitReachedText,
} from '@pagopa-pn/pn-commons';

import { ChannelType } from '../../models/contacts';
import { Party } from '../../models/party';
import { CONTACT_ACTIONS } from '../../redux/contact/actions';
import { getAllActivatedParties } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import {
  emailValidationSchema,
  pecValidationSchema,
  phoneValidationSchema,
} from '../../utility/contacts.utility';
import DropDownPartyMenuItem from '../Party/DropDownParty';
import { SpecialAddress } from './SpecialDigitalContacts';

type Props = {
  open: boolean;
  value: string;
  senders: Array<Party>;
  prefix?: string;
  onDiscard: () => void;
  onConfirm: (value: string, senders: Array<Party>) => void;
  digitalAddresses: Array<SpecialAddress>;
  channelType: ChannelType;
};

const AddSpecialContactDialog: React.FC<Props> = ({
  open,
  value,
  senders,
  prefix,
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
  const contactType = channelType.toLowerCase();
  const parties = useAppSelector((state: RootState) => state.contactsState.parties);

  const checkIfSenderIsAlreadyAdded = (senders: Array<Party>) => {
    const alreadyExists = digitalAddresses.some(
      (addr) =>
        addr.value !== value &&
        addr.senders.some((sender) => senders.some((s) => s.id === sender.senderId))
    );
    if (alreadyExists) {
      setAlreadyExistsMessage(
        t(`special-contacts.${contactType}-already-exists`, {
          ns: 'recapiti',
        })
      );
      return;
    }
    setAlreadyExistsMessage('');
  };

  const senderChangeHandler = async (_: any, newValue: Party | null) => {
    setSenderInputValue('');
    if (newValue) {
      const senders = [...formik.values.senders, newValue];
      await formik.setFieldValue('senders', senders);
      checkIfSenderIsAlreadyAdded(senders);
      return;
    }
    checkIfSenderIsAlreadyAdded(formik.values.senders);
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
    s_value: yup
      .string()
      .when([], {
        is: () => channelType === ChannelType.PEC,
        then: pecValidationSchema(t),
      })
      .when([], {
        is: () => channelType === ChannelType.EMAIL,
        then: emailValidationSchema(t),
      })
      .when([], {
        is: () => channelType === ChannelType.SMS,
        then: phoneValidationSchema(t),
      }),
  });

  const initialValues = {
    senders,
    s_value: prefix ? value.replace(prefix, '') : value,
  };

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onConfirm(values.s_value, values.senders);
    },
  });

  const handleChangeTouched = async (e: ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleSenderDelete = async (sender: Party) => {
    const senders = formik.values.senders.filter((s) => s.id !== sender.id);
    await formik.setFieldValue('senders', senders);
    checkIfSenderIsAlreadyAdded(senders);
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

  const handleClose = () => {
    formik.resetForm({ values: initialValues });
    onDiscard();
  };

  const handleConfirm = async () => {
    await formik.submitForm();
    formik.resetForm({ values: initialValues });
  };

  return (
    <PnDialog open={open} onClose={handleClose} data-testid="addSpecialContactDialog">
      <DialogTitle id="dialog-title">
        {t(`special-contacts.modal-${contactType}-title`, { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="caption-semibold">
            {t(`special-contacts.${contactType}`, { ns: 'recapiti' })}
          </Typography>
          <Stack mt={1} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              inputProps={{ sx: { height: '14px' } }}
              fullWidth
              id="s_value"
              name="s_value"
              placeholder={t(`special-contacts.link-${contactType}-placeholder`, {
                ns: 'recapiti',
              })}
              value={formik.values.s_value}
              onChange={handleChangeTouched}
              error={formik.touched.s_value && Boolean(formik.errors.s_value)}
              helperText={formik.touched.s_value && formik.errors.s_value}
              InputProps={{
                startAdornment: prefix ? (
                  <InputAdornment position="start">{prefix}</InputAdornment>
                ) : null,
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
        </form>
        {formik.values.senders.map((sender) => (
          <Chip
            data-testid="sender_chip"
            key={`${sender.id}_chip`}
            label={sender.name}
            onDelete={() => handleSenderDelete(sender)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
        {alreadyExistsMessage && (
          <Alert severity="warning" sx={{ marginBottom: '20px' }} data-testid="alreadyExistsAlert">
            {alreadyExistsMessage}
          </Alert>
        )}
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={handleClose} variant="outlined">
          {t('button.annulla')}
        </Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!formik.isValid}>
          {t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default AddSpecialContactDialog;
