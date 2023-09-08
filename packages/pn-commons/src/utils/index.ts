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
import { calcUnit8Array } from './file.utility';
import { filtersApplied, getValidValue, sortArray } from './genericFunctions.utility';
import { IUN_regex, formatIun } from './iun.utility';
import { lazyRetry } from './lazyRetry.utility';
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
import {
  searchStringCleanDenomination,
  searchStringLimitReachedText,
  useSearchStringChangeInput,
} from './searchString.utility';
import { storageOpsBuilder } from './storage.utility';
import { dataRegex, formatFiscalCode, sanitizeString } from './string.utility';
import { buttonNakedInheritStyle } from './styles.utility';
import {
  apiOutcomeTestHelper,
  mockApiErrorWrapper,
  simpleMockForApiErrorWrapper,
} from './test.utility';
import {
  adaptedTokenExchangeError,
  basicInitialUserData,
  basicUserDataMatcherContents,
} from './user.utility';

export {
  AppError,
  AppErrorFactory,
  AppResponsePublisher,
  AppRouteParams,
  AppRouteType,
  DATE_FORMAT,
  IUN_regex,
  PRIVACY_LINK_RELATIVE_PATH,
  ResponseEventDispatcher,
  TOS_LINK_RELATIVE_PATH,
  UnknownAppError,
  adaptedTokenExchangeError,
  apiOutcomeTestHelper,
  basicInitialUserData,
  basicUserDataMatcherContents,
  buttonNakedInheritStyle,
  calcUnit8Array,
  calculatePages,
  compileOneTrustPath,
  compileRoute,
  dataRegex,
  dateIsDefined,
  errorFactoryManager,
  filtersApplied,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDay,
  formatEurocentToCurrency,
  formatFiscalCode,
  formatIun,
  formatMonthString,
  formatTime,
  formatToSlicedISOString,
  formatToTimezoneString,
  getF24Payments,
  getLegalFactLabel,
  getNextDay,
  getNotificationAllowedStatus,
  getNotificationStatusInfos,
  getNotificationTimelineStatusInfos,
  getPagoPaF24Payments,
  getValidValue,
  isToday,
  lazyRetry,
  minutesBeforeNow,
  mockApiErrorWrapper,
  parseNotificationDetail,
  performThunkAction,
  populatePaymentsPagoPaF24,
  sanitizeString,
  searchStringCleanDenomination,
  searchStringLimitReachedText,
  simpleMockForApiErrorWrapper,
  sortArray,
  storageOpsBuilder,
  tenYearsAgo,
  today,
  useSearchStringChangeInput,
};
