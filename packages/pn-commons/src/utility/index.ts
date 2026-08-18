export { Configuration } from '../services/configuration.service';
export { getAccessibleIun } from './accessibility.utility';
export { default as AppError } from './AppError/AppError';
export { default as AppErrorFactory } from './AppError/AppErrorFactory';
export { default as errorFactoryManager } from './AppError/ErrorFactoryManager';
export { default as UnknownAppError } from './AppError/UnknownAppError';
export {
  default as AppResponsePublisher,
  ResponseEventDispatcher,
} from './AppResponse/AppResponsePublisher';
export { validateCurrentStatus, validateHistory, validateLegaFact } from './appStatus.utility';
export { appStorage } from './appStorage.utility';
export { LANGUAGES, PRIVACY_LINK_RELATIVE_PATH, TOS_LINK_RELATIVE_PATH } from './costants';
export { formatCurrency, formatEurocentToCurrency } from './currency.utility';
export {
  clampMax,
  convertHoursToDays,
  DATE_FORMAT,
  dateIsDefined,
  dateIsLessThan10Years,
  formatDate,
  formatDateTime,
  formatDay,
  formatMonthString,
  formatShortDate,
  formatTime,
  formatToSlicedISOString,
  formatToTimezoneString,
  getDateFromString,
  getDaysFromDateRange,
  getElapsedTime,
  getEndOfDay,
  getStartOfDay,
  getWeeksFromDateRange,
  isDateInRange,
  isToday,
  minutesBeforeNow,
  oneMonthAgo,
  oneYearAgo,
  sixMonthsAgo,
  subtractMonthsFromDate,
  tenYearsAgo,
  threeMonthsAgo,
  today,
  twelveMonthsAgo,
} from './date.utility';
export { waitForElement } from './dom.utility';
export { APP_VERSION, IS_DEVELOP } from './environment.utility';
export { calcUnit8Array } from './file.utility';
export { filtersApplied, getValidValue, sortArray } from './genericFunctions.utility';
export { formatIun, IUN_regex } from './iun.utility';
export { lazyRetry } from './lazyRetry.utility';
export { initLocalization } from './localization.utility';
export {
  koError,
  superProperty,
  uxAction,
  uxConfirm,
  uxScreenView,
} from './MixpanelUtils/CommonTrackingEvents';
export type { TrackingProperties } from './MixpanelUtils/CommonTrackingEvents';
export { default as EventStrategyFactory } from './MixpanelUtils/EventStrategyFactory';
export {
  getLangCode,
  getSessionLanguage,
  getValidLanguage,
  hashDetectorLookup,
  setSessionLanguage,
} from './multilanguage.utility';
export { addParamToUrl } from './navigation.utility';
export {
  getF24Payments,
  getLegalFactLabel,
  getNotificationAllowedStatus,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from './notification.utility';
export { compileOneTrustPath, rewriteLinks } from './onetrust.utility';
export { calculatePages } from './pagination.utility';
export {
  checkIfPaymentsIsAlreadyInCache,
  getPaymentCache,
  PAYMENT_CACHE_KEY,
  setPaymentCache,
  setPaymentsInCache,
} from './paymentCaching.utility';
export { parseError } from './redux.utility';
export { AppRouteParams, compileRoute, getRapidAccessParam } from './routes.utility';
export * as screenshot from './Screenshot';
export { searchStringLimitReachedText, useSearchStringChangeInput } from './searchString.utility';
export * from './StatusHistory';
export { storageOpsBuilder } from './storage.utility';
export { dataRegex, formatFiscalCode, fromStringToBase64, sanitizeString } from './string.utility';
export { extractRootTraceId } from './support.utility';
export {
  adaptedTokenExchangeError,
  basicInitialUserData,
  basicUserDataMatcherContents,
  removeNullProperties,
} from './user.utility';
export {
  flattenTimelineSteps,
  isTimelineGroupStep,
  toLegacyStatusHistory,
  formatTimelineDate,
} from './notificationTimeline.utility';
