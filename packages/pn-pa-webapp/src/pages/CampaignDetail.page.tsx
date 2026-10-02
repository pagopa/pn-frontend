import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Typography } from '@mui/material';
import { ApiError, EmptyErrorState, TitleBox, useErrors } from '@pagopa-pn/pn-commons';
import { MIBreadcrumbItem, MIBreadcrumbs } from '@pagopa/mui-italia';

import PnCampaignCommunications from '../components/Campaigns/PnCampaignCommunications';
import PnCampaignDetailCard from '../components/Campaigns/PnCampaignDetailCard';
import PnCampaignDetailLoading from '../components/Campaigns/PnCampaignDetailLoading';
import { CommunicationFilters } from '../models/Campaign';
import { PAEventsType } from '../models/PAEventsType';
import * as routes from '../navigation/routes.const';
import {
  CAMPAIGN_ACTIONS,
  getCampaignCommunications,
  getCampaignDetail,
} from '../redux/campaign/actions';
import {
  initialCommunicationFilters,
  initialCommunicationsPagination,
  resetCampaignCommunications,
} from '../redux/campaign/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import PAEventStrategyFactory from '../utility/MixpanelUtils/PAEventStrategyFactory';

const CampaignDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const campaign = useAppSelector((state: RootState) => state.campaignState.campaignDetail);
  const communicationFilters = useAppSelector(
    (state: RootState) => state.campaignState.communicationFilters
  );
  const communicationsPagination = useAppSelector(
    (state: RootState) => state.campaignState.communicationsPagination
  );
  const communicationsCampaignId = useAppSelector(
    (state: RootState) => state.campaignState.communicationsCampaignId
  );
  const { hasApiErrors } = useErrors();
  const [pageReady, setPageReady] = useState(false);
  const [communicationsReady, setCommunicationsReady] = useState(false);
  const [showCommunications, setShowCommunications] = useState<boolean | null>(null);
  const isPageReady = pageReady && communicationsReady;
  const { t } = useTranslation(['campaigns', 'common']);
  const hasCampaignDetailApiError = hasApiErrors(CAMPAIGN_ACTIONS.GET_CAMPAIGN_DETAIL);
  const hasCampaignCommunicationsApiError = hasApiErrors(
    CAMPAIGN_ACTIONS.GET_CAMPAIGN_COMMUNICATIONS
  );

  const fetchCampaignDetail = useCallback(() => {
    if (id) {
      setPageReady(false);

      void dispatch(getCampaignDetail(id))
        .unwrap()
        .then(() => {
          PAEventStrategyFactory.triggerEvent(PAEventsType.SEND_PA_CAMPAIGN_DETAIL);
        })
        .catch(() => {})
        .finally(() => setPageReady(true));
    }
  }, [dispatch, id]);

  const fetchCampaignCommunications = useCallback(
    (page: number, size: number, filters: CommunicationFilters, nextPagesKey?: string) => {
      if (id) {
        setCommunicationsReady(false);
        const filterParams = {
          recipientId: filters.recipientId || undefined,
          iunMatch: filters.iunMatch || undefined,
          status: filters.status.length > 0 ? filters.status : undefined,
          viewed: filters.outcome === 'viewed' ? true : undefined,
          delivered: filters.outcome === 'delivered' ? true : undefined,
        };
        const hasFiltersApplied = Object.values(filterParams).some((value) => value !== undefined);

        void dispatch(
          getCampaignCommunications({
            campaignId: id,
            ...filterParams,
            page,
            size,
            nextPagesKey,
          })
        )
          .unwrap()
          .then((response) => {
            setShowCommunications(
              (currentValue) =>
                hasFiltersApplied || (currentValue ?? (response.resultsPage?.length ?? 0) > 0)
            );
          })
          .catch(() => {})
          .finally(() => setCommunicationsReady(true));
      }
    },
    [dispatch, id]
  );

  const retryCampaignCommunications = () => {
    fetchCampaignCommunications(0, communicationsPagination.size, communicationFilters);
  };

  useEffect(() => {
    fetchCampaignDetail();
  }, [fetchCampaignDetail]);

  useEffect(() => {
    if (!id) {
      return;
    }

    if (communicationsCampaignId === id) {
      const { page, size, nextPagesKey } = communicationsPagination;
      fetchCampaignCommunications(
        page,
        size,
        communicationFilters,
        page === 0 ? undefined : nextPagesKey[page - 1]
      );
      return;
    }

    dispatch(resetCampaignCommunications(id));
    fetchCampaignCommunications(
      0,
      initialCommunicationsPagination.size,
      initialCommunicationFilters
    );
  }, []);

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
      {!isPageReady && <PnCampaignDetailLoading />}
      {isPageReady && hasCampaignDetailApiError && (
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

      {isPageReady && !hasCampaignDetailApiError && (
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

      {isPageReady && (
        <Typography component="h2" variant="h6" sx={{ mt: 3 }}>
          {t('detail.communications.title')}
        </Typography>
      )}

      {isPageReady && hasCampaignCommunicationsApiError && (
        <ApiError
          apiId={CAMPAIGN_ACTIONS.GET_CAMPAIGN_COMMUNICATIONS}
          customErrorComponent={
            <EmptyErrorState
              variant="error"
              title={t('detail.empty-state.generic-error')}
              action={{
                label: t('detail.empty-state.generic-error-cta'),
                onClick: retryCampaignCommunications,
              }}
            />
          }
        />
      )}

      {isPageReady && !hasCampaignCommunicationsApiError && (
        <>
          {showCommunications ? (
            <PnCampaignCommunications
              campaignId={campaign.campaignId}
              fetchCampaignCommunications={fetchCampaignCommunications}
            />
          ) : (
            <EmptyErrorState
              variant="empty"
              title={t('detail.communications.empty-state.title')}
              description={t('detail.communications.empty-state.description')}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default CampaignDetail;
