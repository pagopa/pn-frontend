import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded';
import { Box, Link, Stack, Typography } from '@mui/material';
import { ApiError, LoadingPage, TitleBox, useErrors } from '@pagopa-pn/pn-commons';
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
      gap={3}
    >
      {breadcrumb}
      {hasCampaignDetailApiError && (
        <ApiError
          apiId={CAMPAIGN_ACTIONS.GET_CAMPAIGN_DETAIL}
          /* TODO fare component per errore */
          customErrorComponent={
            <Stack
              sx={{
                p: 3,
                borderRadius: 1,
                backgroundColor: 'background.paper',
              }}
              alignItems="center"
              gap={1}
            >
              <ReportGmailerrorredRoundedIcon />

              <Typography>Non è stato possibile recuperare i dati della campagna.</Typography>

              <Link component="button" fontWeight="bold" onClick={fetchCampaignDetail}>
                Prova di nuovo
              </Link>
            </Stack>
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
