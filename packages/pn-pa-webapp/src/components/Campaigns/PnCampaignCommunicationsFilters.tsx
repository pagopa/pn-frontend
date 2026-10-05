import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, ListItemText, MenuItem, TextField } from '@mui/material';
import { Autocomplete } from '@pagopa/mui-italia';

import { communicationOutcomeOptions, communicationStatusOptions } from '../../models/Campaign';

type Props = {
  formik: any;
  handleChangeTouched: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePaste: (e: React.ClipboardEvent) => Promise<void>;
};

const inputStyle = {
  '& .MuiInputBase-root': {
    height: '48px',
  },
  '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
    transform: 'translate(14px, 12px) scale(1)',
  },
};

const PnCampaignCommunicationsFilters = ({ formik, handleChangeTouched, handlePaste }: Props) => {
  const { t } = useTranslation('campaigns');
  const [inputValue, setInputValue] = useState('');

  const selectedStatusOption = communicationStatusOptions.find(
    (option) =>
      option.value.length === formik.values.status.length &&
      option.value.every((status) => formik.values.status.includes(status))
  );

  useEffect(() => {
    setInputValue(t(selectedStatusOption?.label ?? ''));
  }, [selectedStatusOption?.label, t]);

  return (
    <>
      <Grid item xs={12} lg sx={{ mb: { md: 2.5, lg: 0 } }}>
        <TextField
          id="recipientId"
          name="recipientId"
          value={formik.values.recipientId}
          onChange={handleChangeTouched}
          onPaste={handlePaste}
          label={t('detail.communications.tax-id')}
          error={formik.touched.recipientId && Boolean(formik.errors.recipientId)}
          helperText={formik.touched.recipientId && formik.errors.recipientId}
          fullWidth
          sx={inputStyle}
        />
      </Grid>
      <Grid item xs={12} lg sx={{ mb: { md: 2.5, lg: 0 } }}>
        <TextField
          id="iunMatch"
          name="iunMatch"
          value={formik.values.iunMatch}
          onChange={handleChangeTouched}
          onPaste={handlePaste}
          label={t('detail.communications.iun')}
          error={formik.touched.iunMatch && Boolean(formik.errors.iunMatch)}
          helperText={formik.touched.iunMatch && formik.errors.iunMatch}
          fullWidth
          inputProps={{ maxLength: 25 }}
          sx={inputStyle}
        />
      </Grid>
      <Grid item xs={12} lg sx={{ mb: { md: 2.5, lg: 0 } }}>
        <Autocomplete
          id="status"
          inputValue={inputValue}
          onInputChange={(newInputValue) => setInputValue(newInputValue)}
          options={communicationStatusOptions}
          getOptionLabel={(option) => t(option.label)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          label={t('detail.communications.status')}
          placeholder={t('detail.communications.status')}
          noResultsText={t('autocomplete.no-results', { ns: 'common' })}
          value={selectedStatusOption}
          onChange={(newValue) => {
            void formik.setFieldValue('status', newValue?.value ?? []);
          }}
          slotProps={{
            textField: { name: 'status' },
            clearButton: {
              'aria-label': t('autocomplete.clear', { ns: 'common' }),
            },
            toggleButton: {
              'close-aria-label': t('autocomplete.toggle-close', { ns: 'common' }),
              'open-aria-label': t('autocomplete.toggle-open', { ns: 'common' }),
            },
            selectionBox: {
              'aria-label': t('autocomplete.selection-box', { ns: 'common' }),
            },
            selectionChip: {
              'aria-label': t('autocomplete.delete-selection', { ns: 'common' }),
            },
            announcementBox: {
              selectionText: t('autocomplete.selection-done', { ns: 'common' }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} lg>
        <TextField
          id="outcome"
          data-testid="communicationOutcome"
          name="outcome"
          label={t('detail.communications.outcome')}
          select
          SelectProps={{ displayEmpty: true }}
          InputLabelProps={{ shrink: true }}
          onChange={handleChangeTouched}
          value={formik.values.outcome}
          fullWidth
          sx={inputStyle}
        >
          {communicationOutcomeOptions.map(({ id, label }) => (
            <MenuItem key={id} value={id}>
              <ListItemText>{t(label)}</ListItemText>
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </>
  );
};

export default PnCampaignCommunicationsFilters;
