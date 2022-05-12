import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { storageOnSuccessOps } from '../../utils/storage';
import { redirectToLogin } from '../../utils/utils';

const Logout = () => {
  storageOnSuccessOps.delete();
  storageTokenOps.delete();
  storageUserOps.delete();
  redirectToLogin();

  return <div />;
};

export default Logout;
