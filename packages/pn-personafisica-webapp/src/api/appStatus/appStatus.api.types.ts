export enum IncidentStatus {
  OK = "OK",
  KO = "KO",
}

export enum KnownFunctionality {
  NotificationCreate = "NOTIFICATION_CREATE",
  NotificationVisualization = "NOTIFICATION_VISUALIZZATION",
  NotificationWorkflow = "NOTIFICATION_WORKFLOW",
}

export function isKnownFunctionality(functionality: string): boolean {
  return Object.values(KnownFunctionality).includes(functionality as KnownFunctionality);
}

export interface GetDowntimeHistoryParams {
  startDate: string;
  endDate?: string;
  functionality?: KnownFunctionality[];
  page?: string;
  size?: string;
}
