import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { ArrowForward } from '@mui/icons-material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Box, Typography } from '@mui/material';
import {
  CustomPagination,
  EmptyErrorState,
  INFORMAL_IUN_regex,
  InformalNotificationStatus,
  PaginationData,
  Row,
  SmartActions,
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
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { MIButton } from '@pagopa/mui-italia';

import { BffInformalSenderNotificationSearchRow } from '../../generated-client/informal-notifications';
import { CommunicationFilters } from '../../models/Campaign';
import * as routes from '../../navigation/routes.const';
import { resetCommunicationsPagination } from '../../redux/campaign/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PnCampaignCommunicationsFilters from './PnCampaignCommunicationsFilters';
import PnCommunicationOutcomeTag from './PnCommunicationOutcomeTag';
import PnCommunicationStatusMIChip from './PnCommunicationStatusMiChip';

type CampaignCommunicationRow = BffInformalSenderNotificationSearchRow & {
  action?: string;
};

interface Props {
  campaignId: string;
  fetchCampaignCommunications: (
    page: number,
    size: number,
    filters: CommunicationFilters,
    nextPagesKey?: string
  ) => void;
}

const PnCampaignCommunications = ({ campaignId, fetchCampaignCommunications }: Props) => {
  const { t } = useTranslation('campaigns');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

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

  const validationSchema = yup.object({
    recipientId: yup
      .string()
      .matches(dataRegex.pIvaAndFiscalCode, t('detail.communications.errors.tax-id')),
    iunMatch: yup
      .string()
      .matches(INFORMAL_IUN_regex, t('filters.errors.iun', { ns: 'notifiche' })),
  });

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    const hasSizeChanged = paginationData.size !== communicationsPagination.size;
    const page = hasSizeChanged ? 0 : paginationData.page;

    fetchCampaignCommunications(
      page,
      paginationData.size,
      communicationFilters,
      page === 0 ? undefined : communicationsPagination.nextPagesKey[page - 1]
    );
  };

  const handleClearFilters = () => {
    const emptyFilters: CommunicationFilters = {
      recipientId: '',
      iunMatch: '',
      status: [],
      outcome: '',
    };

    formik.resetForm({
      values: emptyFilters,
    });

    dispatch(resetCommunicationsPagination());
    fetchCampaignCommunications(0, communicationsPagination.size, emptyFilters);
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const trimmedValue = e.clipboardData.getData('text').trim();
    const input = e.target as HTMLInputElement;
    formik.setFieldError(input.name, undefined);
    // eslint-disable-next-line functional/immutable-data
    input.value = trimmedValue;
    await formik.setFieldValue(input.name, trimmedValue, false);
  };

  const handleChangeTouched = async (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldError(e.target.name, undefined);

    if (e.target.name === 'iunMatch') {
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
      await formik.setFieldValue(e.target.name, e.target.value, false);
    }
  };

  const handleSubmitFilters = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const submitted = await formik.submitForm();
    return submitted === true;
  };

  const renderCellContent = (
    row: Row<CampaignCommunicationRow>,
    columnId: keyof CampaignCommunicationRow
  ) => {
    if (columnId === 'iun' && isMobile) {
      return (
        <Typography component="span" fontWeight={600}>
          {row.iun ?? ''}
        </Typography>
      );
    }
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
    return String(row[columnId] ?? '');
  };

  const renderActionButton = (row: Row<CampaignCommunicationRow>) => (
    <MIButton
      variant="text"
      endIcon={<ArrowForward />}
      onClick={() => navigate(routes.GET_DETTAGLIO_COMBO_PATH(campaignId, row.id))}
    >
      {t('button.open', { ns: 'common' })}
    </MIButton>
  );

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
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      dispatch(resetCommunicationsPagination());
      fetchCampaignCommunications(0, communicationsPagination.size, values);
      return Promise.resolve(true);
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
    <Box data-testid="campaignsList">
      <SmartTable
        data={data}
        conf={communicationsColumns}
        testId="campaignCommunicationsTable"
        slotProps={{ table: { sx: { tableLayout: 'fixed' } } }}
        emptyState={
          <EmptyErrorState
            variant="error"
            title={t('detail.communications.empty-title')}
            description={t('detail.communications.empty-description')}
            action={{
              label: t('detail.communications.remove-filters'),
              onClick: handleClearFilters,
            }}
          />
        }
      >
        <SmartFilter
          filterLabel={t('button.filtra', { ns: 'common' })}
          cancelLabel={t('button.annulla filtro', { ns: 'common' })}
          mobileFilterIcon={<FilterAltOutlinedIcon fontSize="small" />}
          onSubmit={handleSubmitFilters}
          onClear={handleClearFilters}
          formIsValid
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
          {data.map((row, index) => {
            const actionButton = renderActionButton(row);

            return (
              <SmartBodyRow key={row.id} index={index} testId="campaignCommunicationsBodyRow">
                {communicationsColumns.map((column) => (
                  <SmartBodyCell
                    key={column.id.toString()}
                    columnId={column.id}
                    mode={column.mode}
                    tableProps={column.tableConfiguration}
                    cardProps={column.cardConfiguration}
                    isCardHeader={column.cardConfiguration?.isCardHeader}
                    hideInCard={column.id === 'action'}
                  >
                    {column.id === 'action' ? actionButton : renderCellContent(row, column.id)}
                  </SmartBodyCell>
                ))}
                <SmartActions>{actionButton}</SmartActions>
              </SmartBodyRow>
            );
          })}
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
