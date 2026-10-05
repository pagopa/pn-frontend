import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { ArrowForward } from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  CustomPagination,
  EmptyErrorState,
  INFORMAL_IUN_regex,
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
    // eslint-disable-next-line functional/immutable-data
    (e.target as HTMLInputElement).value = trimmedValue;
    await formik.setFieldValue((e.target as HTMLInputElement).id, trimmedValue, false);
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
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      await formik.setTouched({ recipientId: true, iunMatch: true }, false);
      return false;
    }
    await formik.submitForm();
    return true;
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
        <MIButton
          variant="text"
          endIcon={<ArrowForward />}
          onClick={() => navigate(routes.GET_DETTAGLIO_COMBO_PATH(campaignId, row.id))}
        >
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
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      dispatch(resetCommunicationsPagination());
      fetchCampaignCommunications(0, communicationsPagination.size, formik.values);
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
            variant="empty"
            title={t('detail.communications.empty-title')}
            description={t('detail.communications.empty-description')}
          />
        }
      >
        <SmartFilter
          filterLabel={t('button.filtra', { ns: 'common' })}
          cancelLabel={t('button.annulla filtro', { ns: 'common' })}
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
