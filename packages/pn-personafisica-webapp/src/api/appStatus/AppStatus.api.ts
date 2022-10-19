export enum IncidentStatus {
    OK = "OK",
    KO = "KO",
}

export interface Incident {
    funcionality: string;
    status: IncidentStatus;

}

export interface FunctionalityStatus {
    functionality: string;
    isOperative: boolean;
    currentIncident?: Incident;
}

export interface AppCurrentStatus {
    appIsFullyOperative: boolean;
    statusByFunctionality: FunctionalityStatus;
}


export const AppStatusApi = {
    getCurrentStatus: () => null,
}