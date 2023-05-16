

export interface PaInfo {
  paId: string;
  paName: string;
  taxId: string;
  address: string;
  fiscalCode: string;
  ipaCode: string;
  pec: string;
  sdiCode: string;
}

export interface EstimateBodyRequest {
  totalDigitalNotif: number;
  total890Notif: number;
  totalAnalogNotif: number;
  splitPayment: boolean;
  description: string;
  mailAddress: string;
}


export interface EstimateDetail {
  paInfo: PaInfo;
  status: EstimateStatusEnum;
  showEdit: boolean;
  deadlineDate: string;
  referenceMonth: string;
  lastModifiedDate: string;
  estimate: Estimate;
  billing: BillingDetail;
}

export interface Estimate {
  totalDigitalNotif: number;
  totalAnalogNotif: number;
  total890Notif: number;
}

export interface EstimatePeriod {
  status: EstimateStatusEnum;
  showEdit: boolean;
  deadlineDate: string;
  referenceMonth: string;
  lastModifiedDate ?: string;
  estimate: Estimate;
  billing: BillingDetail;
}

export interface FilterRequest {
  page: number;
  size: number;
}

export const EstimateStatusEnum = {
  DRAFT: 'DRAFT',
  VALIDATED: 'VALIDATED',
  ABSENT: 'ABSENT',
} as const;

export type EstimateStatusEnum = typeof EstimateStatusEnum[keyof typeof EstimateStatusEnum];

export interface EstimateHistory {
  referenceMonth: string;
  lastModifiedDate: string;
  deadlineDate: string;
  status: EstimateStatusEnum;
}

export interface HistoryEstimates {
  actual: EstimatePeriod;
  history : Page<EstimateHistory>;

}

export interface InfoDownload {
  paId?: string;
  status?: InfoDownloadStatusEnum;

}

export const InfoDownloadStatusEnum = {
  Uploading: 'UPLOADING',
  Uploaded: 'UPLOADED'
} as const;

export type InfoDownloadStatusEnum = typeof InfoDownloadStatusEnum[keyof typeof InfoDownloadStatusEnum];


export type FilterRequestEstimate = {
  paId: string;
  page: number;
  size: number;
};

export type Filter = {
  costCode: string;
};

export type Page<T> = {
  'number' : number;
  size: number;
  totalElements: number;
  content: Array<T>;
};

export interface Profiling {
  paInfo: PaInfo;
  profiles: Array<ProfilingDetail>;

}

export interface ProfilingDetail {
  billing: BillingDetail;
  status: EstimateStatusEnum;
  deadlineDate?: string;
  referenceYear: string;
  showEdit: boolean;
}

export interface BillingDetail {
  sdiCode: string;
  splitPayment: boolean;
  description: string;
  mailAddress: string;

}

export enum StatusUpdateEnum {
  DRAFT = "DRAFT",
  VALIDATED = "VALIDATED"
}


export type HistoryColumn =
    | 'referenceMonth'
    | 'lastModifiedDate'
    | 'deadlineDate'
    | 'status';



export const monthMap: { [key: string]: string } = {
  "GEN": "Gennaio",
  "FEB": "Febbraio",
  "MAR": "Marzo",
  "APR": "Aprile",
  "MAG": "Maggio",
  "GIU": "Giugno",
  "LUG": "Luglio",
  "AGO": "Agosto",
  "SET": "Settembre",
  "OTT": "Ottobre",
  "NOV": "Novembre",
  "DIC": "Dicembre",
};
