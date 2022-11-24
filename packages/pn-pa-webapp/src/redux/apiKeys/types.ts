import { ApiKeySetStatus } from "../../models/ApiKeys";

export type ApiKeyStatusBE = {
  apiKey: string;
  status: ApiKeySetStatus;
};