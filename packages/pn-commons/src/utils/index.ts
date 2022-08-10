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
    formatToTimezoneString
} from './date.utility';
import { IUN_regex, formatIun } from './iun.utility';
import { formatCurrency, formatEurocentToCurrency } from './currency.utility';
import { basicUserDataMatcherContents, basicInitialUserData } from './user.utility';
import { storageOpsBuilder } from './storage.utility';
import { compileRoute } from './routes.utility';
import { URL_DIGITAL_NOTIFICATIONS, PRIVACY_LINK_RELATIVE_PATH } from './costants';

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
    URL_DIGITAL_NOTIFICATIONS,
    PRIVACY_LINK_RELATIVE_PATH
};
