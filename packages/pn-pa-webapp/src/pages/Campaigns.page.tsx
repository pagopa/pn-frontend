import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ArrowForward } from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  ApiErrorWrapper,
  CustomPagination,
  EmptyErrorState,
  PaginationData,
  TitleBox,
  calculatePages,
} from '@pagopa-pn/pn-commons';
import { MIButton, MITableList, MITableListItem, MITableListItemField } from '@pagopa/mui-italia';

/* import { MITableList, MITableListItem, MITableListItemField } from '@pagopa/mui-italia';
import { GET_CAMPAIGN_DETAIL_PATH } from '../navigation/routes.const'; */
import { CAMPAIGN_ACTIONS, getCampaigns } from '../redux/campaign/actions';
import { setPagination } from '../redux/campaign/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const Campaigns = () => {
  const dispatch = useAppDispatch();
  /*   const navigate = useNavigate(); */
  /*   const [loading, setLoading] = useState(false);
  const campaigns = useAppSelector((state: RootState) => state.campaignState.campaigns); */
  const pagination = useAppSelector((state: RootState) => state.campaignState.pagination);
  const { t } = useTranslation(['campaigns', 'common']);

  const totalElements =
    pagination.size *
    (pagination.moreResult
      ? pagination.nextPagesKey.length + 5
      : pagination.nextPagesKey.length + 1);

  const pagesToShow: Array<number> = calculatePages(
    pagination.size,
    totalElements,
    Math.min(pagination.nextPagesKey.length + 1, 3),
    pagination.page + 1
  );

  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  /*   const handleOpenCampaign = (id: string) => {
    navigate(GET_CAMPAIGN_DETAIL_PATH(id));
  }; */

  const fetchCampaigns = useCallback(() => {
    /*  setLoading(true); */

    dispatch(
      getCampaigns({
        size: pagination.size,
        nextPagesKey:
          pagination.page === 0 ? undefined : pagination.nextPagesKey[pagination.page - 1],
      })
    )
      .unwrap()
      .catch(() => {})
      .finally(() => {
        /*     setLoading(false); */
      });
  }, [dispatch, pagination.size, pagination.page]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return (
    <Box p={3}>
      <TitleBox title={t('list.title')} variantTitle="h4" />

      <ApiErrorWrapper
        apiId={CAMPAIGN_ACTIONS.GET_CAMPAIGNS}
        reloadAction={fetchCampaigns}
        customErrorComponent={
          <EmptyErrorState
            variant="error"
            title={t('list.empty-state.generic-error')}
            action={{ label: t('list.empty-state.generic-error-cta'), onClick: fetchCampaigns }}
          />
        }
        mt={3}
      >
        {/* TODO: Temporary fallback until MITableList provides native empty and error state support. */}
        {!loading && campaigns.length === 0 ? (
          <EmptyErrorState title={t('list.empty-state.no-campaigns')} />
        ) : (
          <>
            <MITableList
              loading={loading}
              slotProps={{ skeleton: { action: true, rows: 10 } }}
              columns={[2, 1]}
            >
              {campaigns.map((campaign) => (
                <MITableListItem
                  key={campaign.campaignId}
                  action={
                    <MIButton
                      variant="text"
                      endIcon={<ArrowForward />}
                      onClick={() => handleOpenCampaign(campaign.campaignId)}
                      aria-label={t('list.open-aria-label', { name: campaign.title })}
                    >
                      {t('button.open', { ns: 'common' })}
                    </MIButton>
                  }
                >
                  <MITableListItemField label={formatDate(campaign.startDate)}>
                    {campaign.title}
                  </MITableListItemField>

                  <MITableListItemField label={t('list.id')}>
                    {campaign.campaignId}
                  </MITableListItemField>
                </MITableListItem>
              ))}
            </MITableList>

            {/* TODO: Temporary fallback until MITableList provides native pagination support. */}
            {!loading && campaigns.length > 0 && (
              <CustomPagination
                paginationData={{
                  size: pagination.size,
                  page: pagination.page,
                  totalElements,
                }}
                onPageRequest={handleChangePage}
                pagesToShow={pagesToShow}
              />
            )}
          </>
        )}
      </ApiErrorWrapper>
    </Box>
  );
};

export default Campaigns;
