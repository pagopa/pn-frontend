import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { PnAutocomplete, PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

import { Party } from '../../models/party';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

type Props = {
  open: boolean;
  senderId?: string;
  handleClose: () => void;
  formik: any;
  handleChangeTouched: () => {};
  handleConfirm: () => void;
  renderOption: any;
  senderChangeHandler: any;
  entitySearchLabel: any;
};

const AddSpecialContactDialog: React.FC<Props> = ({
  open,
  senderId = 'default',
  handleClose,
  formik,
  handleChangeTouched,
  handleConfirm,
  renderOption,
  senderChangeHandler,
  entitySearchLabel,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const getOptionLabel = (option: Party) => option.name || '';
  const [senderInputValue, setSenderInputValue] = useState('');
  const parties = useAppSelector((state: RootState) => state.contactsState.parties);

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
