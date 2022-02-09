import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { getSentNotifications } from '../redux/dashboard/actions';
import NotificationsTable from '../components/NotificationsTable/NotificactionsTable';

const Dashboard = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.dashboardState.notifications);
  
  useEffect(() => {
    dispatch(getSentNotifications({ startDate: '2022-01-01T00:00:00.000Z', endDate: '2022-12-31T00:00:00.000Z' }));
  }, []);

  return (
    <React.Fragment>
      {notifications && <NotificationsTable notifications={notifications}/>}
    </React.Fragment>
  );
};

export default Dashboard;
