import { ApiKeyStatus } from "@pagopa-pn/pn-commons";

export type ApiKeyStatusBE = {
  apiKey: string;
  status: ApiKeyStatus;
};