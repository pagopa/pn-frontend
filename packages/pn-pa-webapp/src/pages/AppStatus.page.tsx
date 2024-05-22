import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AppStatusRender,
  GetDowntimeHistoryParams,
  PaginationData,
  appStateActions,
  downloadDocument,
} from '@pagopa-pn/pn-commons';

import {
  getCurrentAppStatus,
  getDowntimeHistory,
  getDowntimeLegalFact,
} from '../redux/appStatus/actions';
import { APP_STATUS_ACTIONS } from '../redux/appStatus/actions';
import { clearPagination, setPagination } from '../redux/appStatus/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const AppStatus = () => {
  const dispatch = useAppDispatch();
  const appStatus = useAppSelector((state: RootState) => state.appStatus);
  const { t } = useTranslation(['appStatus']);

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
    />
  );
};

export default AppStatus;
