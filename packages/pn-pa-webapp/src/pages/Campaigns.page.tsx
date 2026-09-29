import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ArrowForward } from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  ApiErrorWrapper,
  CustomPagination,
  EmptyErrorState,
  PaginationData,
  TitleBox,
  calculatePages,
  formatDate,
} from '@pagopa-pn/pn-commons';
import { MIButton, MITableList, MITableListItem, MITableListItemField } from '@pagopa/mui-italia';

import { PAEventsType } from '../models/PAEventsType';
import { GET_CAMPAIGN_DETAIL_PATH } from '../navigation/routes.const';
import { CAMPAIGN_ACTIONS, getCampaigns } from '../redux/campaign/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import PAEventStrategyFactory from '../utility/MixpanelUtils/PAEventStrategyFactory';

const Campaigns = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const campaigns = useAppSelector((state: RootState) => state.campaignState.campaigns);
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

  const fetchCampaigns = useCallback(
    (page: number, size: number, nextPagesKey?: string) => {
      setLoading(true);

      dispatch(
        getCampaigns({
          page,
          size,
          nextPagesKey,
        })
      )
        .unwrap()
        .then((data) => {
          PAEventStrategyFactory.triggerEvent(PAEventsType.SEND_PA_HAS_CAMPAIGNS, {
            value: data.resultsPage.length > 0,
          });

          PAEventStrategyFactory.triggerEvent(PAEventsType.SEND_PA_CAMPAIGNS, {
            campaigns: data.resultsPage,
            pageNumber: page,
          });
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    },
    [dispatch]
  );

  const handleChangePage = (paginationData: PaginationData) => {
    const hasSizeChanged = paginationData.size !== pagination.size;
    const page = hasSizeChanged ? 0 : paginationData.page;

    fetchCampaigns(
      page,
      paginationData.size,
      page === 0 ? undefined : pagination.nextPagesKey[page - 1]
    );
  };

  const handleOpenCampaign = (id: string) => {
    navigate(GET_CAMPAIGN_DETAIL_PATH(id));
  };

  const reloadCampaigns = useCallback(() => {
    fetchCampaigns(
      pagination.page,
      pagination.size,
      pagination.page === 0 ? undefined : pagination.nextPagesKey[pagination.page - 1]
    );
  }, [fetchCampaigns, pagination.page, pagination.size, pagination.nextPagesKey]);

  useEffect(() => {
    fetchCampaigns(0, pagination.size);
  }, []);

  return (
    <Box p={3}>
      <TitleBox title={t('list.title')} variantTitle="h4" />

      <ApiErrorWrapper
        apiId={CAMPAIGN_ACTIONS.GET_CAMPAIGNS}
        reloadAction={reloadCampaigns}
        customErrorComponent={
          <EmptyErrorState
            variant="error"
            title={t('list.empty-state.generic-error')}
            action={{ label: t('list.empty-state.generic-error-cta'), onClick: reloadCampaigns }}
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
