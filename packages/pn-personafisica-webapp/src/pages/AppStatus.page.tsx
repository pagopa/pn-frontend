import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AppStatusRender, GetDowntimeHistoryParams, PaginationData } from '@pagopa-pn/pn-commons';
import {
  getCurrentAppStatus,
  getDowntimeLegalFactDocumentDetails,
  getDowntimeLogPage,
} from '../redux/appStatus/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import {
  clearLegalFactDocumentData,
  clearPagination,
  setPagination,
} from '../redux/appStatus/reducers';
import { APP_STATUS_ACTIONS } from '../redux/appStatus/actions';

const AppStatus = () => {
  const dispatch = useAppDispatch();
  const appStatus = useAppSelector((state: RootState) => state.appStatus);
  // The useTranslation *must* be activated, even when it is not directly used in this component' code,
  // to avoid problems in the components defined in pn-commons,
  // when these components need to access to localized messages.
  useTranslation(['appStatus']);

  const fetchCurrentStatus = useCallback(() => {
    void dispatch(getCurrentAppStatus());
  }, [dispatch, getCurrentAppStatus]);

  const fetchDowntimeLogPage = useCallback(
    (fetchParams: GetDowntimeHistoryParams) => {
      void dispatch(getDowntimeLogPage(fetchParams));
    },
    [dispatch, getDowntimeLogPage]
  );

  const fetchDowntimeLegalFactDocumentDetails = useCallback(
    (legalFactId: string) => void dispatch(getDowntimeLegalFactDocumentDetails(legalFactId)),
    [dispatch, getDowntimeLegalFactDocumentDetails]
  );

  return (
    <AppStatusRender
      appStatus={appStatus}
      fetchCurrentStatus={fetchCurrentStatus}
      fetchDowntimeLogPage={fetchDowntimeLogPage}
      fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
      clearLegalFactDocument={() => dispatch(clearLegalFactDocumentData())}
      setPagination={(paginationData: PaginationData) =>
        dispatch(setPagination({ size: paginationData.size, page: paginationData.page }))
      }
      clearPagination={() => dispatch(clearPagination())}
      actionIds={APP_STATUS_ACTIONS}
    />
  );
};

export default AppStatus;
