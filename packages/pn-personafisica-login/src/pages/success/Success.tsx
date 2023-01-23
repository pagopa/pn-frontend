import { useEffect } from 'react';
import { PF_URL, PG_URL } from '../../utils/constants';
import { storageTypeOps } from '../../utils/storage';

const SuccessPage = () => {
  const typeUrl = storageTypeOps.read();
  const token = window.location.hash;

  useEffect(() => {
    if ((PF_URL && typeUrl === 'PF') || (PG_URL && typeUrl === 'PG')) {
      storageTypeOps.delete();

      /* eslint-disable-next-line functional/immutable-data */
      window.location.replace(`${typeUrl === 'PF' ? PF_URL : PG_URL}${token}`);
    }
  }, []);

  return null;
};

export default SuccessPage;
