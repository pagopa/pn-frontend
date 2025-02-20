import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getRapidAccessParam } from '@pagopa-pn/pn-commons/src/utility/routes.utility';

export function useRapidAccessParam() {
  const [params] = useSearchParams();

  return useMemo(() => getRapidAccessParam(params), [params]);
}
