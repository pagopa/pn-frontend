import { storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { User } from '../../models/User';
import { readUserFromToken, redirectSuccessLogin } from '../loginSuccess/LoginSuccess';

type Props = {
  sessionToken: string;
};

const ValidateSession = ({ sessionToken }: Props) => {
  const user: User = storageUserOps.read();
  if (!user) {
    readUserFromToken(sessionToken);
  }
  redirectSuccessLogin();

  return <div />;
};

export default ValidateSession;
