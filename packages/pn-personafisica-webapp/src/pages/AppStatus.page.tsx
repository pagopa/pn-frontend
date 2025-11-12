import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AppStatusRender,
  GetDowntimeHistoryParams,
  PaginationData,
  appStateActions,
  downloadDocument,
} from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../models/PFEventsType';
import {
  APP_STATUS_ACTIONS,
  getCurrentAppStatus,
  getDowntimeHistory,
  getDowntimeLegalFact,
} from '../redux/appStatus/actions';
import { clearPagination, setPagination } from '../redux/appStatus/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

const AppStatus = () => {
  const dispatch = useAppDispatch();
  const appStatus = useAppSelector((state: RootState) => state.appStatus);
  const { t } = useTranslation(['appStatus']);
  const { DOWNTIME_EXAMPLE_LINK } = getConfiguration();

  const fetchCurrentStatus = useCallback(() => {
    void dispatch(getCurrentAppStatus());
  }, [dispatch, getCurrentAppStatus]);

  const fetchDowntimeLogPage = useCallback(
    (fetchParams: GetDowntimeHistoryParams) => {
      void dispatch(getDowntimeHistory(fetchParams));
    },
    [dispatch, getDowntimeHistory]
  );

  const fetchDowntimeLegalFactDocumentDetails = useCallback(
    (legalFactId: string) => {
      dispatch(getDowntimeLegalFact(legalFactId))
        .unwrap()
        .then((response) => {
          if (response.retryAfter) {
            dispatch(
              appStateActions.addInfo({
                title: '',
                message: t(`detail.document-not-available`, {
                  ns: 'notifiche',
                }),
              })
            );
          } else if (response.url) {
            downloadDocument(response.url);
          }
        })
        .catch((e) => console.log(e));
    },
    [dispatch, getDowntimeLegalFact]
  );

  const handleTrackDownloadCertificateOpposable3dparties = () => {
    PFEventStrategyFactory.triggerEvent(
      PFEventsType.SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES,
      {
        source: 'stato_piattaforma',
      }
    );
  };

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(
      PFEventsType.SEND_SERVICE_STATUS,
      appStatus.currentStatus?.appIsFullyOperative
    );
  }, [getCurrentAppStatus]);

  console.log('TMP - Force build');

  return (
    <AppStatusRender
      appStatus={appStatus}
      fetchCurrentStatus={fetchCurrentStatus}
      fetchDowntimeLogPage={fetchDowntimeLogPage}
      fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
      setPagination={(paginationData: PaginationData) =>
        dispatch(setPagination({ size: paginationData.size, page: paginationData.page }))
      }
      clearPagination={() => dispatch(clearPagination())}
      actionIds={APP_STATUS_ACTIONS}
      handleTrackDownloadCertificateOpposable3dparties={
        handleTrackDownloadCertificateOpposable3dparties
      }
      downtimeExampleLink={DOWNTIME_EXAMPLE_LINK}
    />
  );
};

export default AppStatus;
