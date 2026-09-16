import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Box } from '@mui/material';
import { ApiError, EmptyErrorState, LoadingPage, TitleBox, useErrors } from '@pagopa-pn/pn-commons';
import { MIBreadcrumbItem, MIBreadcrumbs } from '@pagopa/mui-italia';

import PnCampaignDetailCard from '../components/Campaigns/PnCampaignDetailCard';
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
  const isCampaignDetailEmpty = pageReady && !hasCampaignDetailApiError && !campaign.campaignId;

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
    <MIBreadcrumbs backButtonLabel="Indietro" backButtonAction={() => navigate(routes.DASHBOARD)}>
      <MIBreadcrumbItem
        label="Campagne"
        onClick={() => navigate(routes.CAMPAIGNS)}
        data-testid="breadcrumb-root-button"
      />
      <MIBreadcrumbItem label={campaign.title} current />
    </MIBreadcrumbs>
  );

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'grey.100',
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

      {!hasCampaignDetailApiError && !pageReady && (
        <LoadingPage
          sx={{
            backgroundColor: 'background.paper',
            minHeight: '60vh',
          }}
        />
      )}
      {isCampaignDetailEmpty && (
        <>
          <TitleBox
            title="[Titolo campagna]"
            subTitle="[Descrizione della campagna compilata in fase di inserimento]"
            mbTitle={1}
            variantSubTitle="body1"
          />

          <PnCampaignDetailCard
            creationDate="00/00/0000"
            campaignId="000"
            serviceName="[nome servizio]"
            communications={0}
            channels="-"
          />
        </>
      )}

      {!hasCampaignDetailApiError && pageReady && !isCampaignDetailEmpty && (
        <>
          <TitleBox
            title={campaign.title}
            subTitle={campaign.description}
            mbTitle={1}
            variantSubTitle="body1"
          />

          <PnCampaignDetailCard
            creationDate={campaign.startDate}
            campaignId={campaign.campaignId}
            serviceName={campaign.serviceName}
            communications={0}
            channels={campaign.channels.join(' · ')}
          />
        </>
      )}
    </Box>
  );
};

export default CampaignDetail;
