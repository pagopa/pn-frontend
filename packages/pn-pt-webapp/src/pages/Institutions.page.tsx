import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Box } from '@mui/material';
import {
  CustomPagination,
  EmptyErrorState,
  SmartBody,
  SmartBodyCell,
  SmartBodyRow,
  SmartFilter,
  SmartHeader,
  SmartHeaderCell,
  SmartTable,
  SmartTableData,
  TitleBox,
} from '@pagopa-pn/pn-commons';
import { MIAlert } from '@pagopa/mui-italia';

type InstitutionFilters = {
  institutionName: string;
  taxId: string;
  notificationStatus: string;
};

const InstitutionsPage: React.FC = () => {
  // const dispatch = useAppDispatch();

  const { t } = useTranslation('enti');

  const institutionsPagination = { size: 10, page: 0 };

  const institutionsColumns: Array<SmartTableData<any>> = [
    {
      id: 'institutionName',
      label: t('detail.communications.institution-name'),
      tableConfiguration: {
        cellProps: { width: '25%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'taxId',
      label: t('detail.communications.tax-id'),
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
  ];

  const validationSchema = yup.object({
    institutionName: yup.string(),
    taxId: yup.string(),
    notificationStatus: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      institutionName: '',
      taxId: '',
      notificationStatus: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {},
  });

  const handleClearFilters = () => {
    const emptyFilters: InstitutionFilters = {
      institutionName: '',
      taxId: '',
      notificationStatus: '',
    };

    formik.resetForm({
      values: emptyFilters,
    });

    // dispatch(resetCommunicationsPagination());
    // fetchCampaignCommunications(0, communicationsPagination.size, emptyFilters);
  };

  const institutions: any[] = [];

  return (
    <Box p={3} data-testid="institutionsPage">
      <TitleBox
        title={t('title')}
        subTitle={t('subtitle')}
        variantTitle="h4"
        variantSubTitle="body1"
      />

      <MIAlert severity="info" sx={{ mt: 2 }} data-testid="work-in-progress-alert">
        {t('work-in-progress')}
      </MIAlert>

      <Box data-testid="institutionsList">
        <SmartTable
          data={institutions}
          conf={institutionsColumns}
          testId="institutionsTable"
          slotProps={{ table: { sx: { tableLayout: 'fixed' } } }}
          emptyState={
            <EmptyErrorState
              variant="empty-institution"
              title={t('table.empty.title')}
              description={t('table.empty.description')}
            />
          }
        >
          <SmartFilter
            filterLabel={t('button.filtra', { ns: 'common' })}
            cancelLabel={t('button.annulla filtro', { ns: 'common' })}
            mobileFilterIcon={<FilterAltOutlinedIcon fontSize="small" />}
            onSubmit={() => {}}
            onClear={handleClearFilters}
            formIsValid
            formValues={formik.values}
            initialValues={{
              institutionName: '',
              taxId: '',
              notificationStatus: '',
            }}
          >
            hello
          </SmartFilter>
          <SmartHeader>
            {institutionsColumns.map((column) => (
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
            {institutions.map((row, index) => {
              return (
                <SmartBodyRow key={row.id} index={index} testId="institutionsBodyRow">
                  {institutionsColumns.map((column) => (
                    <SmartBodyCell
                      key={column.id.toString()}
                      columnId={column.id}
                      mode={column.mode}
                      tableProps={column.tableConfiguration}
                      cardProps={column.cardConfiguration}
                      isCardHeader={column.cardConfiguration?.isCardHeader}
                      hideInCard={column.id === 'action'}
                    >
                      {'hello'}
                    </SmartBodyCell>
                  ))}
                </SmartBodyRow>
              );
            })}
          </SmartBody>
        </SmartTable>
        {institutions.length > 0 && (
          <CustomPagination
            paginationData={{
              size: institutionsPagination.size,
              page: institutionsPagination.page,
              totalElements: 100,
            }}
            onPageRequest={() => {}}
            pagesToShow={[1]}
          />
        )}
      </Box>
    </Box>
  );
};

export default InstitutionsPage;
