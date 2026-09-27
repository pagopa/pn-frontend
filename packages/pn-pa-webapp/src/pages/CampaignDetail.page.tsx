import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Box } from '@mui/material';
import { ApiError, EmptyErrorState, TitleBox, useErrors } from '@pagopa-pn/pn-commons';
import { MIBreadcrumbItem, MIBreadcrumbs } from '@pagopa/mui-italia';

import PnCampaignDetailCard from '../components/Campaigns/PnCampaignDetailCard';
import PnCampaignDetailLoading from '../components/Campaigns/PnCampaignDetailLoading';
import * as routes from '../navigation/routes.const';
import { CAMPAIGN_ACTIONS, getCampaignDetail } from '../redux/campaign/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const CampaignDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const campaign = useAppSelector((state: RootState) => state.campaignState.campaignDetail);
  const { hasApiErrors } = useErrors();
  const [pageReady, setPageReady] = useState(false);
  const { t } = useTranslation(['campaigns', 'common']);
  const hasCampaignDetailApiError = hasApiErrors(CAMPAIGN_ACTIONS.GET_CAMPAIGN_DETAIL);

  const fetchCampaignDetail = useCallback(() => {
    if (id) {
      setPageReady(false);

      void dispatch(getCampaignDetail(id))
        .unwrap()
        .catch(() => {})
        .finally(() => setPageReady(true));
    }
  }, [dispatch, id]);

  useEffect(() => {
    fetchCampaignDetail();
  }, [fetchCampaignDetail]);

  const breadcrumb = (
    <MIBreadcrumbs
      backButtonLabel={t('detail.breadcrumb.back')}
      backButtonAction={() => navigate(routes.CAMPAIGNS)}
    >
      <MIBreadcrumbItem
        label={t('detail.breadcrumb.campaigns')}
        onClick={() => navigate(routes.CAMPAIGNS)}
        data-testid="breadcrumb-root-button"
      />
      <MIBreadcrumbItem
        label={campaign.title || t('detail.empty-state.campaign-title-placeholder')}
        current
      />
    </MIBreadcrumbs>
  );

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'grey.50',
      }}
    >
      {breadcrumb}
      {hasCampaignDetailApiError && (
        <ApiError
          apiId={CAMPAIGN_ACTIONS.GET_CAMPAIGN_DETAIL}
          customErrorComponent={
            <EmptyErrorState
              variant="error"
              title={t('detail.empty-state.generic-error')}
              action={{
                label: t('detail.empty-state.generic-error-cta'),
                onClick: fetchCampaignDetail,
              }}
            />
          }
        />
      )}

      {!hasCampaignDetailApiError && !pageReady && <PnCampaignDetailLoading />}

      {!hasCampaignDetailApiError && pageReady && (
        <>
          <TitleBox
            title={campaign.title}
            subTitle={campaign.description}
            mbTitle={1}
            mbSubTitle={2}
            variantSubTitle="body1"
          />

          <PnCampaignDetailCard
            creationDate={campaign.startDate}
            campaignId={campaign.campaignId}
            serviceName={campaign.serviceName}
            channels={campaign.channels
              .map((channel) => t(`detail.channels.${channel}`))
              .join(' · ')}
          />
        </>
      )}
    </Box>
  );
};

export default CampaignDetail;
