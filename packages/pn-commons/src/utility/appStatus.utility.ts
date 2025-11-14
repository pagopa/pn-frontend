import {
  AppCurrentStatus,
  DowntimeLogHistory,
  LegalFactDocumentDetails,
} from '../models/AppStatus';
import { AppStatusDTOValidator } from '../validators/appStatus.validator';
import { DowntimeLogHistoryDTOValidator } from '../validators/appStatus.validator';

export class BadApiDataException extends Error {
  constructor(message: string, public details: any) {
    super(message);
  }
}

export function validateCurrentStatus(response: AppCurrentStatus) {
  // pn-validator validation
  const validationResult = new AppStatusDTOValidator().validate(response);
  if (validationResult != null) {
    throw new BadApiDataException('Wrong-formed data', validationResult);
  }
}

export function validateHistory(response: DowntimeLogHistory) {
  // pn-validator validation
  const validationResult = new DowntimeLogHistoryDTOValidator().validate(response);
  if (validationResult != null) {
    throw new BadApiDataException('Wrong-formed data', validationResult);
  }

  // extra validation: downtime with fileAvailable but without legalFactId
  if (response.result.some((downtime) => downtime.fileAvailable && !downtime.legalFactId)) {
    throw new BadApiDataException(
      'Wrong data - a downtime marked as fileAvailable must indicate a legalFactId',
      {}
    );
  }
}

export function validateLegaFact(response: LegalFactDocumentDetails) {
  // validation: the response must include an actual value for url
  if (!response.url && !response.retryAfter) {
    throw new BadApiDataException('The response must include a URL or a retryAfter', {});
  }
}
