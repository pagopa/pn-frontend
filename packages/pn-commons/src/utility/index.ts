import { Configuration } from '../services/configuration.service';
import { AppError, AppErrorFactory, UnknownAppError, errorFactoryManager } from './AppError';
import { AppResponsePublisher, ResponseEventDispatcher } from './AppResponse';
import { PRIVACY_LINK_RELATIVE_PATH, TOS_LINK_RELATIVE_PATH } from './costants';
import { formatCurrency, formatEurocentToCurrency } from './currency.utility';
import {
  DATE_FORMAT,
  dateIsDefined,
  formatDate,
  formatDateTime,
  formatDay,
  formatMonthString,
  formatTime,
  formatToSlicedISOString,
  formatToTimezoneString,
  getNextDay,
  isToday,
  minutesBeforeNow,
  tenYearsAgo,
  today,
} from './date.utility';
import { waitForElement } from './dom.utility';
import { calcUnit8Array } from './file.utility';
import { filtersApplied, getValidValue, sortArray } from './genericFunctions.utility';
import { IUN_regex, formatIun } from './iun.utility';
import { lazyRetry } from './lazyRetry.utility';
import { initLocalization } from './localization.utility';
import {
  getF24Payments,
  getLegalFactLabel,
  getNotificationAllowedStatus,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
  getPagoPaF24Payments,
  parseNotificationDetail,
  populatePaymentsPagoPaF24,
} from './notification.utility';
import { compileOneTrustPath } from './onetrust.utility';
import { calculatePages } from './pagination.utility';
import { performThunkAction } from './redux.utility';
import { AppRouteParams, AppRouteType, compileRoute } from './routes.utility';
import { searchStringLimitReachedText, useSearchStringChangeInput } from './searchString.utility';
import { storageOpsBuilder } from './storage.utility';
import { dataRegex, formatFiscalCode, sanitizeString } from './string.utility';
import { buttonNakedInheritStyle } from './styles.utility';
import {
  adaptedTokenExchangeError,
  basicInitialUserData,
  basicUserDataMatcherContents,
} from './user.utility';

export {
  getNotificationAllowedStatus,
  getNotificationStatusInfos,
  parseNotificationDetail,
  filtersApplied,
  calculatePages,
  isToday,
  formatDate,
  formatMonthString,
  formatToSlicedISOString,
  formatDay,
  formatTime,
  getNextDay,
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
  AppRouteType,
  AppRouteParams,
  today,
  tenYearsAgo,
  DATE_FORMAT,
  getLegalFactLabel,
  getNotificationTimelineStatusInfos,
  basicUserDataMatcherContents,
  basicInitialUserData,
  adaptedTokenExchangeError,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
  performThunkAction,
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
};
