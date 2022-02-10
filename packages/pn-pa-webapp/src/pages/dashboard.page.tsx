import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../redux/store';
import { getSentNotifications } from '../redux/dashboard/actions';
import NotificationsTable from '../components/Notifications/NotificactionsTable';
import FilterNotificationsTable from '../components/Notifications/FilterNotificationsTable';

const Dashboard = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.dashboardState.notifications);

  useEffect(() => {
    dispatch(
      getSentNotifications({
        startDate: '2022-01-01T00:00:00.000Z',
        endDate: '2022-12-31T00:00:00.000Z',
      })
    );
  }, []);

  // TODO: Remove extra style and extra div
  return (
    <div style={{ padding: '20px', width: '100%', backgroundColor: '#F2F2F2' }}>
      <Fragment>
        {notifications ? (
          <div>
            <FilterNotificationsTable />
            <NotificationsTable notifications={notifications} />
          </div>
        ) : null}
      </Fragment>
    </div>
  );
};

export default Dashboard;
