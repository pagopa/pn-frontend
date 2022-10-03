import { ApiKeyStatus } from "../../models/ApiKeys";

export type ApiKeyStatusBE = {
  apiKey: string;
  status: ApiKeyStatus;
};