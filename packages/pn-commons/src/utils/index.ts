import { dataRegex, formatFiscalCode } from './string.utility';
import { calculatePages } from './pagination.utility';
import {
    getNotificationStatusInfos,
    getNotificationAllowedStatus,
    parseNotificationDetail,
    filtersApplied,
    getLegalFactLabel,
    getNotificationTimelineStatusInfos
} from './notification.utility';
import { getValidValue } from './genericFunctions.utility';
import {
    getMonthString,
    getDay,
    getTime,
    today,
    tenYearsAgo,
    DATE_FORMAT,
    getNextDay,
    minutesBeforeNow,
    formatToTimezoneString
} from './date.utility';
import { IUN_regex, formatIun } from './iun.utility';
import { formatCurrency, formatEurocentToCurrency } from './currency.utility';
import { basicUserDataMatcherContents, basicInitialUserData, adaptedTokenExchangeError } from './user.utility';
import { storageOpsBuilder } from './storage.utility';
import { compileRoute } from './routes.utility';
import { URL_DIGITAL_NOTIFICATIONS, PRIVACY_LINK_RELATIVE_PATH, TOS_LINK_RELATIVE_PATH } from './costants';
import { mockApiErrorWrapper, simpleMockForApiErrorWrapper, apiOutcomeTestHelper } from './test.utility';
import { performThunkAction } from './redux.utility';

export {
    getNotificationAllowedStatus,
    getNotificationStatusInfos,
    parseNotificationDetail,
    filtersApplied,
    calculatePages,
    getMonthString,
    getDay,
    getTime,
    getNextDay,
    minutesBeforeNow,
    formatToTimezoneString,
    getValidValue,
    formatFiscalCode,
    IUN_regex,
    formatIun,
    formatCurrency,
    formatEurocentToCurrency,
    dataRegex,
    storageOpsBuilder,
    compileRoute,
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
};
