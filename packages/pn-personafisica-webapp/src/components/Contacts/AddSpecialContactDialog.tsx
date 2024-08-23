import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
import {
  PnAutocomplete,
  PnDialog,
  PnDialogActions,
  PnDialogContent,
  searchStringLimitReachedText,
} from '@pagopa-pn/pn-commons';

import { DigitalAddress } from '../../models/contacts';
import { Party } from '../../models/party';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import DropDownPartyMenuItem from '../Party/DropDownParty';

type Props = {
  open: boolean;
  senderId?: string;
  handleClose: () => void;
  formik: any;
  handleConfirm: () => void;
  digitalAddresses: Array<DigitalAddress>;
};

type Addresses = {
  [senderId: string]: Array<DigitalAddress>;
};

const AddSpecialContactDialog: React.FC<Props> = ({
  open,
  senderId = 'default',
  handleClose,
  formik,
  handleConfirm,
  digitalAddresses,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const getOptionLabel = (option: Party) => option.name || '';
  const [senderInputValue, setSenderInputValue] = useState('');
  const [alreadyExistsMessage, setAlreadyExistsMessage] = useState('');

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

  const contactType = formik.values.addressType?.toLowerCase();

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

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  return (
    <PnDialog open={open} onClose={handleClose} data-testid="cancelVerificationModal">
      <DialogTitle id="dialog-title">
        {t('special-contacts.modal-title', { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <Typography variant="caption-semibold">
          {t(`special-contacts.email`, { ns: 'recapiti' })}
        </Typography>
        <Stack mt={1} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            inputProps={{ sx: { height: '14px' } }}
            fullWidth
            {...{
              id: `${senderId}_email`,
              name: `${senderId}_email`,
              placeholder: t(`special-contacts.link-email-placeholder`, { ns: 'recapiti' }),
              value: formik.values[`${senderId}_email`],
              onChange: handleChangeTouched,
              error:
                formik.touched[`${senderId}_email`] && Boolean(formik.errors[`${senderId}_email`]),
              helperText: formik.touched[`${senderId}_email`] && formik.errors[`${senderId}_email`],
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
