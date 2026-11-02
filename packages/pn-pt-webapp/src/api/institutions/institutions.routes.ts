import { compileRoute } from '@pagopa-pn/pn-commons';

// TODO: align with the BFF contract once the OpenAPI spec is available
const API_VERSION_SEGMENT = 'bff/v1';
const API_INSTITUTIONS = 'pt/institutions';

export function INSTITUTIONS_LIST() {
  return compileRoute({
    prefix: API_VERSION_SEGMENT,
    path: API_INSTITUTIONS,
  });
}
