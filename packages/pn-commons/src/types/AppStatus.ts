import { AppCurrentStatus, DowntimeLogPage, LegalFactDocumentDetails } from "../models";

export interface AppStatusData {
  currentStatus?: AppCurrentStatus;
  downtimeLogPage?: DowntimeLogPage;
  legalFactDocumentData?: LegalFactDocumentDetails;
  pagination: { size: number; page: number; resultPages: Array<string> };
};
