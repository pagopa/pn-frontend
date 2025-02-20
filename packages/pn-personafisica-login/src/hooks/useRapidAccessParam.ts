import { getRapidAccessParam } from '@pagopa-pn/pn-commons/src/utility/routes.utility';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useRapidAccessParam() {
  const [params] = useSearchParams();

  return useMemo(() => getRapidAccessParam(params), [params]);
}
