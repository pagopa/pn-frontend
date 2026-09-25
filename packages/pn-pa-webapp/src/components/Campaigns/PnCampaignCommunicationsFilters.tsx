import { useTranslation } from 'react-i18next';

import { Grid, ListItemText, MenuItem, TextField } from '@mui/material';
import { Autocomplete } from '@pagopa/mui-italia';

import { communicationOutcomeOptions, communicationStatusOptions } from '../../models/Campaign';

type Props = {
  formik: any;
  handleChangeTouched: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePaste: (e: React.ClipboardEvent) => Promise<void>;
};

const PnCampaignCommunicationsFilters = ({ formik, handleChangeTouched, handlePaste }: Props) => {
  const { t } = useTranslation('campaigns');

  const selectedStatusOption = communicationStatusOptions.find(
    (option) =>
      option.value.length === formik.values.status.length &&
      option.value.every((status) => formik.values.status.includes(status))
  );

  return (
    <>
      <Grid item xs={12} lg>
        <TextField
          id="recipientId"
          name="recipientId"
          value={formik.values.recipientId}
          onChange={handleChangeTouched}
          onPaste={handlePaste}
          label={t('detail.communications.tax-id')}
          error={formik.touched.recipientId && Boolean(formik.errors.recipientId)}
          helperText={formik.touched.recipientId && formik.errors.recipientId}
          size="small"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} lg>
        <TextField
          id="iunMatch"
          name="iunMatch"
          value={formik.values.iunMatch}
          onChange={handleChangeTouched}
          onPaste={handlePaste}
          label={t('detail.communications.iun')}
          error={formik.touched.iunMatch && Boolean(formik.errors.iunMatch)}
          helperText={formik.touched.iunMatch && formik.errors.iunMatch}
          size="small"
          fullWidth
          inputProps={{ maxLength: 25 }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        lg
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '43px',
            minHeight: '43px',
          },
          '& input#status': {
            position: 'relative',
          },
        }}
      >
        <Autocomplete
          id="status"
          options={communicationStatusOptions}
          getOptionLabel={(option) => t(option.label)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          label={t('detail.communications.status')}
          placeholder={t('detail.communications.status')}
          value={selectedStatusOption}
          inputValue={t(selectedStatusOption?.label ?? '')}
          onChange={(newValue) => {
            void formik.setFieldValue('status', newValue?.value ?? []);
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
          onChange={handleChangeTouched}
          value={formik.values.outcome}
          fullWidth
          size="small"
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
