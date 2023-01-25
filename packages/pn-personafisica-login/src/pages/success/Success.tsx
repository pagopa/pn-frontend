import { useEffect } from 'react';
import { AppRouteParams, AppRouteType, sanitizeString } from '@pagopa-pn/pn-commons';

import { PF_URL, PG_URL } from '../../utils/constants';
import { storageAarOps, storageTypeOps } from '../../utils/storage';

const SuccessPage = () => {
  const typeUrl = storageTypeOps.read();
  const aar = storageAarOps.read();
  const token = window.location.hash;

  useEffect(() => {
    /* eslint-disable-next-line functional/no-let */
    let redirectUrl = '';
    if ((PF_URL && typeUrl === AppRouteType.PF) || (PG_URL && typeUrl === AppRouteType.PG)) {
      storageTypeOps.delete();
      /* eslint-disable-next-line functional/immutable-data */
      redirectUrl = `${typeUrl === AppRouteType.PF ? PF_URL : PG_URL}`;
    }

    // the includes check is needed to prevent xss attacks
    if (redirectUrl && [PF_URL, PG_URL].includes(redirectUrl) && aar) {
      storageAarOps.delete();
      /* eslint-disable-next-line functional/immutable-data */
      redirectUrl += `?${AppRouteParams.AAR}=${sanitizeString(aar)}`;
    }

    // the findIndex check is needed to prevent xss attacks
    if (
      redirectUrl &&
      [PF_URL, PG_URL].findIndex((url) => url && redirectUrl.startsWith(url)) > -1
    ) {
      window.location.replace(`${redirectUrl}${sanitizeString(token)}`);
    }
  }, []);

  return null;
};

export default SuccessPage;
