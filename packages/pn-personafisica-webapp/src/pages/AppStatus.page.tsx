import { Box } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';
import { useCallback, useEffect } from 'react';
import { getCurrentStatus } from '../redux/appStatus/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';


/* eslint-disable-next-line arrow-body-style */
const AppStatus = () => {
  const dispatch = useAppDispatch();
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);

  const fetchCurrentStatus = useCallback(() => {
    void dispatch(getCurrentStatus());
  }, []);

  useEffect(() => {
    fetchCurrentStatus();
  }, [fetchCurrentStatus]);

  return <Box p={3}>
    <TitleBox title="Stato della piattaforma" variantTitle='h4'/>
    { currentStatus && <div>{currentStatus.appIsFullyOperative ? "green" : "red"}</div>}
  </Box>;
};

export default AppStatus;
