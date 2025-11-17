export { Configuration } from '../services/configuration.service';
export { default as EventStrategyFactory } from './MixpanelUtils/EventStrategyFactory';
export { AppError, AppErrorFactory, UnknownAppError, errorFactoryManager } from './AppError';
export { AppResponsePublisher, ResponseEventDispatcher } from './AppResponse';
export * as screenshot from './Screenshot';
export { validateCurrentStatus, validateHistory, validateLegaFact } from './appStatus.utility';
export { PRIVACY_LINK_RELATIVE_PATH, TOS_LINK_RELATIVE_PATH } from './costants';
export { formatCurrency, formatEurocentToCurrency } from './currency.utility';
export {
  DATE_FORMAT,
  convertHoursToDays,
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
  getEndOfDay,
  getStartOfDay,
  getWeeksFromDateRange,
  isToday,
  minutesBeforeNow,
  oneMonthAgo,
  oneYearAgo,
  sixMonthsAgo,
  tenYearsAgo,
  threeMonthsAgo,
  today,
  twelveMonthsAgo,
} from './date.utility';
export { waitForElement } from './dom.utility';
export { APP_VERSION, IS_DEVELOP } from './environment.utility';
export { calcUnit8Array } from './file.utility';
export { filtersApplied, getValidValue, sortArray } from './genericFunctions.utility';
export { IUN_regex, formatIun } from './iun.utility';
export { lazyRetry } from './lazyRetry.utility';
export { initLocalization } from './localization.utility';
export {
  getLangCode,
  getSessionLanguage,
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
  PAYMENT_CACHE_KEY,
  checkIfPaymentsIsAlreadyInCache,
  getPaymentCache,
  setPaymentCache,
  setPaymentsInCache,
} from './paymentCaching.utility';
export { parseError } from './redux.utility';
export { AppRouteParams, compileRoute, getRapidAccessParam } from './routes.utility';
export { storageOpsBuilder } from './storage.utility';
export { dataRegex, formatFiscalCode, fromStringToBase64, sanitizeString } from './string.utility';
export { buttonNakedInheritStyle } from './styles.utility';
export { extractRootTraceId } from './support.utility';
export {
  adaptedTokenExchangeError,
  basicInitialUserData,
  basicUserDataMatcherContents,
} from './user.utility';
export { searchStringLimitReachedText, useSearchStringChangeInput } from './searchString.utility';
