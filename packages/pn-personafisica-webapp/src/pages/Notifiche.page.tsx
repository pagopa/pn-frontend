import { Typography } from '@mui/material';
import FilterNotificationsTable from '../component/notification/FilterNotificationsTable';
import NotificationsTable from '../component/notification/NotificactionsTable';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const Notifiche = () => {
  const user = useAppSelector((state: RootState) => state.userState.user);

  return (
    <div>
      <Typography variant={'h4'}>Ciao {user.name}, benvenuto nella sezione Notifiche</Typography>
      <FilterNotificationsTable/>
      <NotificationsTable/>
    </div>
  );
};

export default Notifiche;
