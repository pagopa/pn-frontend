import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { ArrowForward } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import {
  CustomPagination,
  EmptyErrorState,
  IUN_regex,
  InformalNotificationStatus,
  PaginationData,
  Row,
  SmartBody,
  SmartBodyCell,
  SmartBodyRow,
  SmartFilter,
  SmartHeader,
  SmartHeaderCell,
  SmartTable,
  SmartTableData,
  calculatePages,
  dataRegex,
  formatIun,
} from '@pagopa-pn/pn-commons';
import { MIButton } from '@pagopa/mui-italia';

import { BffInformalSenderNotificationSearchRow } from '../../generated-client/informal-notifications';
import {
  resetCommunicationsPagination,
  setCommunicationFilters,
  setCommunicationsPagination,
} from '../../redux/campaign/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PnCampaignCommunicationsFilters from './PnCampaignCommunicationsFilters';
import PnCommunicationOutcomeTag from './PnCommunicationOutcomeTag';
import PnCommunicationStatusMIChip from './PnCommunicationStatusMiChip';

type CampaignCommunicationRow = BffInformalSenderNotificationSearchRow & {
  action?: string;
};

const PnCampaignCommunications = () => {
  const { t } = useTranslation('campaigns');

  const communicationsPagination = useAppSelector(
    (state: RootState) => state.campaignState.communicationsPagination
  );

  const totalElements =
    communicationsPagination.size *
    (communicationsPagination.moreResult
      ? communicationsPagination.nextPagesKey.length + 5
      : communicationsPagination.nextPagesKey.length + 1);
  const pagesToShow: Array<number> = calculatePages(
    communicationsPagination.size,
    totalElements,
    Math.min(communicationsPagination.nextPagesKey.length + 1, 3),
    communicationsPagination.page + 1
  );

  const dispatch = useAppDispatch();

  const validationSchema = yup.object({
    recipientId: yup
      .string()
      .matches(dataRegex.pIvaAndFiscalCode, t('filters.errors.fiscal-code', { ns: 'notifiche' })),
    iunMatch: yup.string().matches(IUN_regex, t('filters.errors.iun', { ns: 'notifiche' })),
  });

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(
      setCommunicationsPagination({
        size: paginationData.size,
        page: paginationData.page,
      })
    );
  };

  const handleClearFilters = () => {
    formik.resetForm({
      values: {
        recipientId: '',
        iunMatch: '',
        status: [],
        outcome: '',
      },
    });

    dispatch(resetCommunicationsPagination());

    dispatch(
      setCommunicationFilters({
        recipientId: '',
        iunMatch: '',
        status: [],
        outcome: '',
      })
    );
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const trimmedValue = e.clipboardData.getData('text').trim();
    // eslint-disable-next-line functional/immutable-data
    (e.target as HTMLInputElement).value = trimmedValue;
    await formik.setFieldValue((e.target as HTMLInputElement).id, trimmedValue, false);
  };

  const handleChangeTouched = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      await formik.setFieldValue('iunMatch', newInput);
      await formik.setFieldTouched('iunMatch', true, false);

      originalEvent.setSelectionRange(newCursorPosition, newCursorPosition);
    } else {
      formik.handleChange(e);
      await formik.setFieldTouched(e.target.id, true, false);
    }
  };

  const renderCellContent = (
    row: Row<CampaignCommunicationRow>,
    columnId: keyof CampaignCommunicationRow
  ) => {
    if (columnId === 'notificationStatus') {
      return (
        <PnCommunicationStatusMIChip
          status={row.notificationStatus as InformalNotificationStatus}
        />
      );
    }

    if (columnId === 'communicationOutcomes') {
      return <PnCommunicationOutcomeTag outcomes={row.communicationOutcomes} />;
    }

    if (columnId === 'action') {
      return (
        <MIButton variant="text" endIcon={<ArrowForward />}>
          {t('button.open', { ns: 'common' })}
        </MIButton>
      );
    }

    return String(row[columnId] ?? '');
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
      dispatch(resetCommunicationsPagination());
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

  const communicationsColumns: Array<SmartTableData<CampaignCommunicationRow>> = [
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
    {
      id: 'action',
      label: '',
      tableConfiguration: {
        cellProps: { width: '10%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
  ];

  const data: Array<Row<CampaignCommunicationRow>> = (campaignCommunications.resultsPage ?? []).map(
    (communication) => ({
      ...communication,
      id: communication.iun ?? '',
    })
  );

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
          onClear={handleClearFilters}
          formIsValid={formik.isValid}
          formValues={formik.values}
          initialValues={{
            recipientId: '',
            iunMatch: '',
            status: [],
            outcome: '',
          }}
        >
          <PnCampaignCommunicationsFilters
            formik={formik}
            handleChangeTouched={handleChangeTouched}
            handlePaste={handlePaste}
          />
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
                  {renderCellContent(row, column.id)}
                </SmartBodyCell>
              ))}
            </SmartBodyRow>
          ))}
        </SmartBody>
      </SmartTable>
      {data.length > 0 && (
        <CustomPagination
          paginationData={{
            size: communicationsPagination.size,
            page: communicationsPagination.page,
            totalElements,
          }}
          onPageRequest={handleChangePage}
          pagesToShow={pagesToShow}
        />
      )}
    </Box>
  );
};

export default PnCampaignCommunications;
