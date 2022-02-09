import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSentNotifications } from '../redux/dashboard/actions';
import { RootState } from '../redux/store';
import NotificationsTable from '../components/NotificationsTable/NotificactionsTable';

const Dashboard = () => {
  // const user = useSelector((state: RootState) => state.userState.user);
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.dashboardState.notifications);

  useEffect(() => {
    dispatch(getSentNotifications({ startDate: '2021-02-09T11:43:15.179Z', endDate: '2022-02-09T11:43:15.179Z' }));
  }, []);

  /*
  useEffect(() => {
    if (notifications !== []) {
      // TODO fai delle cose
    }
  }, [notifications]);
  */

  return (
    <React.Fragment>
      {notifications && <NotificationsTable />}
    </React.Fragment>
  );
};

export default Dashboard;
