import { dataRegex, formatFiscalCode, sanitizeString } from './string.utility';
import { calculatePages } from './pagination.utility';

import {
  getNotificationStatusInfos,
  getNotificationAllowedStatus,
  parseNotificationDetail,
  filtersApplied,
  getLegalFactLabel,
  getNotificationTimelineStatusInfos,
} from './notification.utility';
import { getValidValue } from './genericFunctions.utility';
import { compileOneTrustPath } from './onetrust.utility';
import {
  formatMonthString,
  formatDay,
  formatTime,
  today,
  isToday,
  tenYearsAgo,
  DATE_FORMAT,
  getNextDay,
  minutesBeforeNow,
  formatToTimezoneString,
  formatDate,
  formatDateTime,
  formatToSlicedISOString,
} from './date.utility';
import { IUN_regex, formatIun } from './iun.utility';
import { formatCurrency, formatEurocentToCurrency } from './currency.utility';
import {
  basicUserDataMatcherContents,
  basicInitialUserData,
  adaptedTokenExchangeError,
} from './user.utility';
import { storageOpsBuilder } from './storage.utility';
import { compileRoute, AppRouteType, AppRouteParams } from './routes.utility';
import {
  URL_DIGITAL_NOTIFICATIONS,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
} from './costants';
import {
  mockApiErrorWrapper,
  simpleMockForApiErrorWrapper,
  apiOutcomeTestHelper,
} from './test.utility';
import { performThunkAction } from './redux.utility';
import { ResponseEventDispatcher, AppResponsePublisher } from './AppResponse';
import { AppError, AppErrorFactory, errorFactoryManager, UnknownAppError } from './AppError';

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
  minutesBeforeNow,
  formatToTimezoneString,
  getValidValue,
  formatFiscalCode,
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
  URL_DIGITAL_NOTIFICATIONS,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
  mockApiErrorWrapper,
  apiOutcomeTestHelper,
  simpleMockForApiErrorWrapper,
  performThunkAction,
  AppResponsePublisher,
  ResponseEventDispatcher,
  AppError,
  AppErrorFactory,
  errorFactoryManager,
  UnknownAppError,
  sanitizeString,
  compileOneTrustPath,
};
