import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.userState.user);

  return (
    <h1>
      Ciao {user.name} {user.family_name}, benvenuto su Piattaforma Notifiche
    </h1>
  );
};

export default Dashboard;
