import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Box } from '@mui/material';
import { ApiError, LoadingPage, TitleBox, useErrors } from '@pagopa-pn/pn-commons';
import { MIBreadcrumbItem, MIBreadcrumbs } from '@pagopa/mui-italia';

import InformalNotificationSenderTimeline from '../components/Notifications/InformalNotificationSenderTimeline';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  getSentInformalNotificationTimeline,
} from '../redux/notification/actions';
import { resetState } from '../redux/notification/reducers';
import { RootState } from '../redux/store';

const InformalNotificationTimeline: React.FC = () => {
  const { campaignId, id } = useParams();
  const { t } = useTranslation(['campaigns', 'common']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hasApiErrors } = useErrors();

  const [pageReady, setPageReady] = useState(false);

  const hasTimelineApiError = hasApiErrors(
    NOTIFICATION_ACTIONS.GET_SENT_INFORMAL_NOTIFICATION_TIMELINE
  );

  const informalNotificationTimeline = useAppSelector(
    (state: RootState) => state.notificationState.informalNotificationTimeline
  );

  const goToCampaignDetail = () => {
    if (campaignId) {
      navigate(routes.GET_CAMPAIGN_DETAIL_PATH(campaignId));
    }
  };

  const iun = informalNotificationTimeline.iun || id;

  const goToInformalNotificationDetail = () => {
    if (campaignId && iun) {
      navigate(routes.GET_DETTAGLIO_COMBO_PATH(campaignId, iun));
    }
  };

  const fetchInformalNotificationTimeline = useCallback(() => {
    if (!id) {
      return;
    }

    setPageReady(false);

    void dispatch(getSentInformalNotificationTimeline(id))
      .unwrap()
      .catch(() => {})
      .finally(() => setPageReady(true));
  }, [dispatch, id]);

  useEffect(() => {
    fetchInformalNotificationTimeline();
    return () => void dispatch(resetState());
  }, [fetchInformalNotificationTimeline]);

  const breadcrumb = (
    <MIBreadcrumbs
      backButtonLabel={t('button.indietro', { ns: 'common' })}
      backButtonAction={goToInformalNotificationDetail}
    >
      <MIBreadcrumbItem
        label={t('detail.breadcrumb-root')}
        onClick={() => navigate(routes.CAMPAIGNS)}
        data-testid="breadcrumb-root-button"
      />
      <MIBreadcrumbItem label={campaignId ?? ''} onClick={goToCampaignDetail} />
      <MIBreadcrumbItem label={iun ?? ''} onClick={goToInformalNotificationDetail} />
      <MIBreadcrumbItem label={t('informal.timeline.title')} current />
    </MIBreadcrumbs>
  );

  return (
    <>
      {hasTimelineApiError && (
        <Box sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          {breadcrumb}
          <ApiError
            onClick={fetchInformalNotificationTimeline}
            mt={3}
            apiId={NOTIFICATION_ACTIONS.GET_SENT_INFORMAL_NOTIFICATION_TIMELINE}
          />
        </Box>
      )}

      {!hasTimelineApiError && !pageReady && (
        <LoadingPage
          sx={{
            backgroundColor: 'background.paper',
            minHeight: '60vh',
          }}
        />
      )}

      {!hasTimelineApiError && pageReady && (
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {breadcrumb}

          <TitleBox title={t('informal.timeline.title')} mbTitle={0} mtGrid={2} />

          <InformalNotificationSenderTimeline
            statusHistory={informalNotificationTimeline.notificationStatusHistory}
            communicationOutcomes={informalNotificationTimeline.communicationOutcomes}
          />
        </Box>
      )}
    </>
  );
};

export default InformalNotificationTimeline;
