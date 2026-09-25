import { useTranslation } from 'react-i18next';

import { Grid, ListItemText, MenuItem, TextField } from '@mui/material';
import { InformalNotificationStatus } from '@pagopa-pn/pn-commons';
import { Autocomplete } from '@pagopa/mui-italia';

type Props = {
  formik: any;
  handleChangeTouched: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePaste: (e: React.ClipboardEvent) => Promise<void>;
};

const PnCampaignCommunicationsFilters = ({ formik, handleChangeTouched, handlePaste }: Props) => {
  const { t } = useTranslation('campaigns');

  const CampaignCommunicationStatusFilter = {
    READY: 'READY',
    PROCESSING: 'PROCESSING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    REFUSED: 'REFUSED',
  };

  const statusOptions = [
    {
      id: CampaignCommunicationStatusFilter.READY,
      label: t('detail.communications.statuses.ready'),
      value: [InformalNotificationStatus.ACCEPTED],
    },
    {
      id: CampaignCommunicationStatusFilter.PROCESSING,
      label: t('detail.communications.statuses.processing'),
      value: [InformalNotificationStatus.PROCESSING],
    },
    {
      id: CampaignCommunicationStatusFilter.SUCCESS,
      label: t('detail.communications.statuses.success'),
      value: [
        InformalNotificationStatus.COMPLETED_REACHED,
        InformalNotificationStatus.COMPLETED_UNREACHED,
      ],
    },
    {
      id: CampaignCommunicationStatusFilter.FAILED,
      label: t('detail.communications.statuses.failed'),
      value: [InformalNotificationStatus.UNDELIVERABLE],
    },
    {
      id: CampaignCommunicationStatusFilter.REFUSED,
      label: t('detail.communications.statuses.refused'),
      value: [InformalNotificationStatus.REFUSED],
    },
  ];

  const outcomeOptions = [
    {
      id: '',
      label: t('detail.communications.outcomes.all'),
    },
    {
      id: 'viewed',
      label: t('detail.communications.outcomes.viewed'),
    },
    {
      id: 'delivered',
      label: t('detail.communications.outcomes.delivered'),
    },
  ];

  const selectedStatusOption = statusOptions.find(
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
      <Grid item xs={12} lg>
        <Autocomplete
          id="status"
          options={statusOptions}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          label={t('detail.communications.status')}
          placeholder={t('detail.communications.status')}
          value={selectedStatusOption}
          inputValue={selectedStatusOption?.label ?? ''}
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
          {outcomeOptions.map(({ id, label }) => (
            <MenuItem key={id} value={id}>
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </>
  );
};

export default PnCampaignCommunicationsFilters;
