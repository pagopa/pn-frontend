import { Configuration } from '../services/configuration.service';
import EventStrategyFactory from '../utility/MixpanelUtils/EventStrategyFactory';
import { AppError, AppErrorFactory, UnknownAppError, errorFactoryManager } from './AppError';
import { AppResponsePublisher, ResponseEventDispatcher } from './AppResponse';
import * as screenshot from './Screenshot';
import { validateCurrentStatus, validateHistory, validateLegaFact } from './appStatus.utility';
import { PRIVACY_LINK_RELATIVE_PATH, TOS_LINK_RELATIVE_PATH } from './costants';
import { formatCurrency, formatEurocentToCurrency } from './currency.utility';
import {
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
import { waitForElement } from './dom.utility';
import { APP_VERSION, IS_DEVELOP } from './environment.utility';
import { calcUnit8Array } from './file.utility';
import { filtersApplied, getValidValue, sortArray } from './genericFunctions.utility';
import { IUN_regex, formatIun } from './iun.utility';
import { lazyRetry } from './lazyRetry.utility';
import { initLocalization } from './localization.utility';
import { getLangCode, hashDetectorLookup, setSessionLanguage } from './multilanguage.utility';
import {
  getF24Payments,
  getLegalFactLabel,
  getNotificationAllowedStatus,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from './notification.utility';
import { compileOneTrustPath, rewriteLinks } from './onetrust.utility';
import { calculatePages } from './pagination.utility';
import {
  PAYMENT_CACHE_KEY,
  checkIfPaymentsIsAlreadyInCache,
  getPaymentCache,
  setPaymentCache,
  setPaymentsInCache,
} from './paymentCaching.utility';
import { parseError } from './redux.utility';
import { AppRouteParams, compileRoute, getRapidAccessParam } from './routes.utility';
import { searchStringLimitReachedText, useSearchStringChangeInput } from './searchString.utility';
import { storageOpsBuilder } from './storage.utility';
import { dataRegex, formatFiscalCode, fromStringToBase64, sanitizeString } from './string.utility';
import { buttonNakedInheritStyle } from './styles.utility';
import { extractRootTraceId } from './support.utility';
import {
  adaptedTokenExchangeError,
  basicInitialUserData,
  basicUserDataMatcherContents,
} from './user.utility';

export {
  getNotificationAllowedStatus,
  getNotificationStatusInfos,
  filtersApplied,
  calculatePages,
  isToday,
  formatDate,
  formatMonthString,
  formatToSlicedISOString,
  formatDay,
  formatTime,
  getEndOfDay,
  getStartOfDay,
  dateIsDefined,
  minutesBeforeNow,
  formatToTimezoneString,
  getValidValue,
  formatFiscalCode,
  searchStringLimitReachedText,
  useSearchStringChangeInput,
  formatDateTime,
  IUN_regex,
  formatIun,
  formatCurrency,
  formatEurocentToCurrency,
  dataRegex,
  storageOpsBuilder,
  compileRoute,
  AppRouteParams,
  today,
  oneMonthAgo,
  threeMonthsAgo,
  sixMonthsAgo,
  twelveMonthsAgo,
  oneYearAgo,
  tenYearsAgo,
  DATE_FORMAT,
  getLegalFactLabel,
  getNotificationTimelineStatusInfos,
  basicUserDataMatcherContents,
  basicInitialUserData,
  adaptedTokenExchangeError,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
  AppResponsePublisher,
  ResponseEventDispatcher,
  AppError,
  AppErrorFactory,
  UnknownAppError,
  buttonNakedInheritStyle,
  calcUnit8Array,
  compileOneTrustPath,
  errorFactoryManager,
  getF24Payments,
  getPagoPaF24Payments,
  lazyRetry,
  populatePaymentsPagoPaF24,
  sanitizeString,
  sortArray,
  waitForElement,
  initLocalization,
  Configuration,
  getPaymentCache,
  setPaymentCache,
  setPaymentsInCache,
  checkIfPaymentsIsAlreadyInCache,
  PAYMENT_CACHE_KEY,
  rewriteLinks,
  dateIsLessThan10Years,
  EventStrategyFactory,
  formatShortDate,
  parseError,
  validateHistory,
  validateCurrentStatus,
  validateLegaFact,
  convertHoursToDays,
  getLangCode,
  setSessionLanguage,
  hashDetectorLookup,
  screenshot,
  getDaysFromDateRange,
  getWeeksFromDateRange,
  getDateFromString,
  fromStringToBase64,
  IS_DEVELOP,
  APP_VERSION,
  getRapidAccessParam,
  extractRootTraceId,
};
