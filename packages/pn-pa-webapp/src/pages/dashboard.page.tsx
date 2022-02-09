import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSentNotifications } from '../redux/dashboard/actions';
import { RootState } from '../redux/store';

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.userState.user);
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.dashboardState.notifications);

  useEffect(() => {
    dispatch(getSentNotifications({ startDate: '', endDate: '' }));
  }, []);

  useEffect(() => {
    if (notifications !== []) {
      // TODO fai delle cose
    }
  }, [notifications]);

  return (
    <h1>
      Ciao {user.name} {user.family_name}, benvenuto su Piattaforma Notifiche
      {notifications}
    </h1>
  );
};

export default Dashboard;
