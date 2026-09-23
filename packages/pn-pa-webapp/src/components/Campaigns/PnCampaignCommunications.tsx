import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Box, Grid, ListItemText, MenuItem, TextField, Typography } from '@mui/material';
import {
  EmptyErrorState,
  IUN_regex,
  InformalNotificationStatus,
  Row,
  SmartBody,
  SmartBodyCell,
  SmartBodyRow,
  SmartFilter,
  SmartHeader,
  SmartHeaderCell,
  SmartTable,
  SmartTableData,
  dataRegex,
  formatIun,
} from '@pagopa-pn/pn-commons';
import { Autocomplete } from '@pagopa/mui-italia';

import { BffInformalSenderNotificationSearchRow } from '../../generated-client/informal-notifications';
import { setCommunicationFilters } from '../../redux/campaign/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

const PnCampaignCommunications = () => {
  const { t } = useTranslation('campaigns');

  const statusOptions = [
    {
      id: InformalNotificationStatus.ACCEPTED,
      label: t('detail.communications.statuses.ready'),
    },
    {
      id: InformalNotificationStatus.PROCESSING,
      label: t('detail.communications.statuses.processing'),
    },
    {
      id: InformalNotificationStatus.UNDELIVERABLE,
      label: t('detail.communications.statuses.failed'),
    },
    {
      id: InformalNotificationStatus.REFUSED,
      label: t('detail.communications.statuses.refused'),
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

  const dispatch = useAppDispatch();

  const validationSchema = yup.object({
    recipientId: yup
      .string()
      .matches(dataRegex.pIvaAndFiscalCode, t('filters.errors.fiscal-code', { ns: 'notifiche' })),
    iunMatch: yup.string().matches(IUN_regex, t('filters.errors.iun', { ns: 'notifiche' })),
  });

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const trimmedValue = e.clipboardData.getData('text').trim();
    // eslint-disable-next-line functional/immutable-data
    (e.target as HTMLInputElement).value = trimmedValue;
    await formik.setFieldValue((e.target as HTMLInputElement).id, trimmedValue, false);
  };

  const handleChangeTouched = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formik.errors) {
      formik.setErrors({
        ...formik.errors,
        [e.target.id]: undefined,
      });
    }

    if (e.target.id === 'iunMatch') {
      const originalEvent = e.target;
      const cursorPosition = originalEvent.selectionStart || 0;
      const newInput = formatIun(originalEvent.value);

      const newCursorPosition =
        cursorPosition +
        (originalEvent.value.length !== newInput?.length &&
        cursorPosition >= originalEvent.value.length
          ? 1
          : 0);

      await formik.setFieldValue('iunMatch', newInput, false);

      originalEvent.setSelectionRange(newCursorPosition, newCursorPosition);
    } else {
      await formik.setFieldValue(e.target.id, e.target.value, false);
    }
  };

  const campaignCommunications = useAppSelector(
    (state: RootState) => state.campaignState.campaignCommunications
  );

  const communicationFilters = useAppSelector(
    (state: RootState) => state.campaignState.communicationFilters
  );

  const formik = useFormik({
    initialValues: {
      recipientId: communicationFilters.recipientId,
      iunMatch: communicationFilters.iunMatch,
      status: communicationFilters.status,
      outcome: communicationFilters.outcome,
    },
    validationSchema,
    onSubmit: () => {
      dispatch(
        setCommunicationFilters({
          ...communicationFilters,
          recipientId: formik.values.recipientId,
          iunMatch: formik.values.iunMatch,
          status: formik.values.status,
          outcome: formik.values.outcome,
        })
      );
    },
  });

  const communicationsColumns: Array<SmartTableData<BffInformalSenderNotificationSearchRow>> = [
    {
      id: 'recipients',
      label: t('detail.communications.tax-id'),
      tableConfiguration: {
        cellProps: { width: '25%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'iun',
      label: t('detail.communications.iun'),
      tableConfiguration: {
        cellProps: { width: '25%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'notificationStatus',
      label: t('detail.communications.status'),
      tableConfiguration: {
        cellProps: { width: '20%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'communicationOutcomes',
      label: t('detail.communications.outcome'),
      tableConfiguration: {
        cellProps: { width: '20%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
  ];

  const data: Array<Row<BffInformalSenderNotificationSearchRow>> = (
    campaignCommunications.resultsPage ?? []
  ).map((communication) => ({
    ...communication,
    id: communication.iun ?? '',
  }));

  return (
    <Box sx={{ mt: 3 }}>
      <Typography component="h2" variant="h6">
        {t('detail.communications.title')}
      </Typography>

      <SmartTable
        data={data}
        conf={communicationsColumns}
        testId="campaignCommunicationsTable"
        slotProps={{ table: { sx: { tableLayout: 'fixed' } } }}
        emptyState={
          <EmptyErrorState
            variant="empty"
            title={t('detail.communications.empty-title')}
            description={t('detail.communications.empty-description')}
          />
        }
      >
        <SmartFilter
          filterLabel={t('button.filtra', { ns: 'common' })}
          cancelLabel={t('button.annulla filtro', { ns: 'common' })}
          onSubmit={formik.handleSubmit}
          onClear={() => {}}
          formIsValid={formik.isValid}
          formValues={formik.values}
          initialValues={{
            recipientId: '',
            iunMatch: '',
            status: '',
            outcome: '',
          }}
        >
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
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label={t('detail.communications.status')}
              placeholder={t('detail.communications.status')}
              value={statusOptions.find((option) => option.id === formik.values.status)}
              onChange={(newValue) => {
                void formik.setFieldValue('status', newValue?.id ?? '');
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
        </SmartFilter>
        <SmartHeader>
          {communicationsColumns.map((column) => (
            <SmartHeaderCell
              key={column.id.toString()}
              columnId={column.id}
              sortable={column.tableConfiguration.sortable}
              cellProps={column.tableConfiguration.cellProps}
            >
              {column.label}
            </SmartHeaderCell>
          ))}
        </SmartHeader>

        <SmartBody>
          {data.map((row, index) => (
            <SmartBodyRow key={row.id} index={index} testId="campaignCommunicationsBodyRow">
              {communicationsColumns.map((column) => (
                <SmartBodyCell
                  key={column.id.toString()}
                  columnId={column.id}
                  mode={column.mode}
                  tableProps={column.tableConfiguration}
                  cardProps={column.cardConfiguration}
                  isCardHeader={column.cardConfiguration?.isCardHeader}
                >
                  {String(row[column.id] ?? '')}
                </SmartBodyCell>
              ))}
            </SmartBodyRow>
          ))}
        </SmartBody>
      </SmartTable>
    </Box>
  );
};

export default PnCampaignCommunications;
