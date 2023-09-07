import { DowntimeStatus, FunctionalityStatus, KnownFunctionality } from '../../../models';

export function statusByFunctionalityOk(
  ...excludingFuncs: KnownFunctionality[]
): FunctionalityStatus[] {
  return Object.values(KnownFunctionality)
    .filter((func) => !excludingFuncs.includes(func))
    .map((func) => ({
      rawFunctionality: func,
      knownFunctionality: func,
      isOperative: true,
    }));
}

export function downStatusOnKnownFunctionality(
  func: KnownFunctionality,
  incidentTimestamp: string
): FunctionalityStatus {
  return {
    rawFunctionality: func,
    knownFunctionality: func,
    isOperative: false,
    currentDowntime: {
      rawFunctionality: func,
      knownFunctionality: func,
      status: DowntimeStatus.KO,
      startDate: incidentTimestamp,
      fileAvailable: false,
    },
  };
}

export function downStatusOnUnknownFunctionality(
  func: string,
  incidentTimestamp: string
): FunctionalityStatus {
  return {
    rawFunctionality: func,
    isOperative: false,
    currentDowntime: {
      rawFunctionality: func,
      status: DowntimeStatus.KO,
      startDate: incidentTimestamp,
      fileAvailable: false,
    },
  };
}
