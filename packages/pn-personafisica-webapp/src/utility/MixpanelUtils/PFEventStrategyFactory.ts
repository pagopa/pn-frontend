import { EventStrategy, EventStrategyFactory } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { SendAcceptDelegationStrategy } from './Strategies/SendAcceptDelegationStrategy';
import { SendAddContactActionStrategy } from './Strategies/SendAddContactActionStrategy';
import { SendAddContactScreenViewStrategy } from './Strategies/SendAddContactScreenViewStrategy';
import { SendAddCourtesyAddressStrategy } from './Strategies/SendAddCourtesyAddressStrategy';
import { SendAddLegalAddressStrategy } from './Strategies/SendAddLegalAddressStrategy';
import { SendAddMandateUXConversionStrategy } from './Strategies/SendAddMandateUXConversionStrategy';
import { SendAddMandateUXSuccessStrategy } from './Strategies/SendAddMandateUXSuccessStrategy';
import { SendDisableIOStrategy } from './Strategies/SendDisableIOStrategy';
import { SendDownloadCertificateOpposable } from './Strategies/SendDownloadCertificateOpposable';
import { SendDownloadResponseStrategy } from './Strategies/SendDownloadResponse';
import { SendEnableIOStrategy } from './Strategies/SendEnableIOStrategy';
import { SendGenericErrorStrategy } from './Strategies/SendGenericErrorStrategy';
import { SendHasAddressesStrategy } from './Strategies/SendHasAddressesStrategy';
import { SendHasMandateGivenStrategy } from './Strategies/SendHasMandateGivensStrategy';
import { SendHasMandateLoginStrategy } from './Strategies/SendHasMandateLoginStrategy';
import { SendHasMandateStrategy } from './Strategies/SendHasMandateStrategy';
import { SendNotificationCountStrategy } from './Strategies/SendNotificationCount';
import { SendNotificationDetailStrategy } from './Strategies/SendNotificationDetailStrategy';
import { SendNotificationStatusDetailStrategy } from './Strategies/SendNotificationStatusDetail';
import { SendPaymentDetailErrorStrategy } from './Strategies/SendPaymentDetailErrorStrategy';
import { SendPaymentOutcomeStrategy } from './Strategies/SendPaymentOutcomeStrategy';
import { SendPaymentStatusStrategy } from './Strategies/SendPaymentStatusStrategy';
import { SendPaymentsCountStrategy } from './Strategies/SendPaymentsCountStrategy';
import { SendRefreshPageStrategy } from './Strategies/SendRefreshPageStrategy';
import { SendRemoveContactSuccessStrategy } from './Strategies/SendRemoveContactSuccess';
import { SendRemoveCourtesyAddressStrategy } from './Strategies/SendRemoveCourtesyAddress';
import { SendRemoveLegalAddressStrategy } from './Strategies/SendRemoveLegalAddress';
import { SendServiceStatusStrategy } from './Strategies/SendServiceStatusStrategy';
import { SendToastErrorStrategy } from './Strategies/SendToastErrorStrategy';
import { SendViewContactDetailsStrategy } from './Strategies/SendViewContactDetailsStrategy';
import { SendViewProfileStrategy } from './Strategies/SendViewProfileStrategy';
import { SendYourContactDetailsStrategy } from './Strategies/SendYourContactDetailsStrategy';
import { SendYourMandatesStrategy } from './Strategies/SendYourMandatesStrategy';
import { SendYourNotificationsStrategy } from './Strategies/SendYourNotificationsStrategy';
import { TechScreenViewStrategy } from './Strategies/TechScreenViewStrategy';
import { TechStrategy } from './Strategies/TechStrategy';
import { UXActionStrategy } from './Strategies/UXActionStrategy';
import { UXErrorStrategy } from './Strategies/UXErrorStrategy';
import { UXScreenViewStrategy } from './Strategies/UXScreenViewStrategy';

const isUXActionStrategy = (eventType: PFEventsType) =>
  [
    PFEventsType.SEND_DOWNLOAD_ATTACHMENT,
    PFEventsType.SEND_DOWNLOAD_RECEIPT_NOTICE,
    PFEventsType.SEND_START_PAYMENT,
    PFEventsType.SEND_PAYMENT_DETAIL_REFRESH,
    PFEventsType.SEND_ADD_MANDATE_START,
    PFEventsType.SEND_ADD_MANDATE_BACK,
    PFEventsType.SEND_SHOW_MANDATE_CODE,
    PFEventsType.SEND_MANDATE_REVOKED,
    PFEventsType.SEND_MANDATE_REJECTED,
    PFEventsType.SEND_MANDATE_ACCEPTED,
    PFEventsType.SEND_ACTIVE_IO_START,
    PFEventsType.SEND_DEACTIVE_IO_START,
    PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION,
    PFEventsType.SEND_DEACTIVE_IO_UX_CONVERSION,
    PFEventsType.SEND_CANCELLED_NOTIFICATION_REFOUND_INFO,
    PFEventsType.SEND_MULTIPAYMENT_MORE_INFO,
    PFEventsType.SEND_PAYMENT_LIST_CHANGE_PAGE,
    PFEventsType.SEND_F24_DOWNLOAD,
    PFEventsType.SEND_DOWNLOAD_PAYMENT_NOTICE,
  ].includes(eventType);

const isSendAddContactActionStrategy = (eventType: PFEventsType) =>
  [
    PFEventsType.SEND_ADD_EMAIL_START,
    PFEventsType.SEND_ADD_SMS_START,
    PFEventsType.SEND_ADD_PEC_START,
    PFEventsType.SEND_ADD_PEC_UX_CONVERSION,
    PFEventsType.SEND_ADD_SMS_UX_CONVERSION,
    PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION,
  ].includes(eventType);

const isSendRemoveContactSuccessStrategy = (eventType: PFEventsType) =>
  [
    PFEventsType.SEND_REMOVE_EMAIL_SUCCESS,
    PFEventsType.SEND_REMOVE_SMS_SUCCESS,
    PFEventsType.SEND_REMOVE_PEC_SUCCESS,
  ].includes(eventType);

const isSendAddContactScreenViewStrategy = (eventType: PFEventsType) =>
  [
    PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS,
    PFEventsType.SEND_ADD_SMS_UX_SUCCESS,
    PFEventsType.SEND_ADD_PEC_UX_SUCCESS,
  ].includes(eventType);

const isUXScreenViewStrategy = (eventType: PFEventsType) =>
  [
    PFEventsType.SEND_PROFILE,
    PFEventsType.SEND_ADD_MANDATE_DATA_INPUT,
    PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS,
    PFEventsType.SEND_DEACTIVE_IO_UX_SUCCESS,
  ].includes(eventType);

const isUXErrorStrategy = (eventType: PFEventsType) =>
  [
    PFEventsType.SEND_MANDATE_ACCEPT_CODE_ERROR,
    PFEventsType.SEND_ADD_PEC_CODE_ERROR,
    PFEventsType.SEND_ADD_SMS_CODE_ERROR,
    PFEventsType.SEND_ADD_EMAIL_CODE_ERROR,
  ].includes(eventType);

const isTechStrategy = (eventType: PFEventsType) =>
  [
    PFEventsType.SEND_RAPID_ACCESS,
    PFEventsType.SEND_AUTH_SUCCESS,
    PFEventsType.SEND_F24_DOWNLOAD_SUCCESS,
    PFEventsType.SEND_F24_DOWNLOAD_TIMEOUT,
  ].includes(eventType);

const eventStrategy: Partial<Record<PFEventsType, any>> = {
  [PFEventsType.SEND_VIEW_PROFILE]: new SendViewProfileStrategy(),
  [PFEventsType.SEND_VIEW_CONTACT_DETAILS]: new SendViewContactDetailsStrategy(),
  [PFEventsType.SEND_NOTIFICATION_DETAIL]: new SendNotificationDetailStrategy(),
  [PFEventsType.SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES]:
    new SendDownloadCertificateOpposable(),
  [PFEventsType.SEND_YOUR_NOTIFICATIONS]: new SendYourNotificationsStrategy(),
  [PFEventsType.SEND_NOTIFICATION_DELEGATED]: new SendYourNotificationsStrategy(),
  [PFEventsType.SEND_NOTIFICATION_STATUS_DETAIL]: new SendNotificationStatusDetailStrategy(),
  [PFEventsType.SEND_YOUR_MANDATES]: new SendYourMandatesStrategy(),
  [PFEventsType.SEND_ADD_MANDATE_UX_CONVERSION]: new SendAddMandateUXConversionStrategy(),
  [PFEventsType.SEND_ADD_MANDATE_UX_SUCCESS]: new SendAddMandateUXSuccessStrategy(),
  [PFEventsType.SEND_YOUR_CONTACT_DETAILS]: new SendYourContactDetailsStrategy(),
  [PFEventsType.SEND_SERVICE_STATUS]: new SendServiceStatusStrategy(),
  [PFEventsType.SEND_REFRESH_PAGE]: new SendRefreshPageStrategy(),
  [PFEventsType.SEND_TOAST_ERROR]: new SendToastErrorStrategy(),
  [PFEventsType.SEND_GENERIC_ERROR]: new SendGenericErrorStrategy(),
  [PFEventsType.SEND_PAYMENT_OUTCOME]: new SendPaymentOutcomeStrategy(),
  [PFEventsType.SEND_DOWNLOAD_RESPONSE]: new SendDownloadResponseStrategy(),
  [PFEventsType.SEND_PAYMENT_STATUS]: new SendPaymentStatusStrategy(),
  [PFEventsType.SEND_PAYMENT_DETAIL_ERROR]: new SendPaymentDetailErrorStrategy(),
  [PFEventsType.SEND_NOTIFICATION_NOT_ALLOWED]: new TechScreenViewStrategy(),
  [PFEventsType.SEND_HAS_ADDRESSES]: new SendHasAddressesStrategy(),
  [PFEventsType.SEND_HAS_MANDATE_LOGIN]: new SendHasMandateLoginStrategy(),
  [PFEventsType.SEND_MANDATE_GIVEN]: new SendHasMandateGivenStrategy(),
  [PFEventsType.SEND_HAS_MANDATE]: new SendHasMandateStrategy(),
  [PFEventsType.SEND_DISABLE_IO]: new SendDisableIOStrategy(),
  [PFEventsType.SEND_ENABLE_IO]: new SendEnableIOStrategy(),
  [PFEventsType.SEND_ACCEPT_DELEGATION]: new SendAcceptDelegationStrategy(),
  [PFEventsType.SEND_REMOVE_LEGAL_ADDRESS]: new SendRemoveLegalAddressStrategy(),
  [PFEventsType.SEND_ADD_LEGAL_ADDRESS]: new SendAddLegalAddressStrategy(),
  [PFEventsType.SEND_NOTIFICATIONS_COUNT]: new SendNotificationCountStrategy(),
  [PFEventsType.SEND_PAYMENTS_COUNT]: new SendPaymentsCountStrategy(),
  [PFEventsType.SEND_REMOVE_COURTESY_ADDRESS]: new SendRemoveCourtesyAddressStrategy(),
  [PFEventsType.SEND_ADD_COURTESY_ADDRESS]: new SendAddCourtesyAddressStrategy(),
};

class PFEventStrategyFactory extends EventStrategyFactory<PFEventsType> {
  getStrategy(eventType: PFEventsType): EventStrategy | null {
    if (isUXActionStrategy(eventType)) {
      return new UXActionStrategy();
    }

    if (isSendAddContactActionStrategy(eventType)) {
      return new SendAddContactActionStrategy();
    }

    if (isSendRemoveContactSuccessStrategy(eventType)) {
      return new SendRemoveContactSuccessStrategy();
    }

    if (isSendAddContactScreenViewStrategy(eventType)) {
      return new SendAddContactScreenViewStrategy();
    }

    if (isUXScreenViewStrategy(eventType)) {
      return new UXScreenViewStrategy();
    }

    if (isUXErrorStrategy(eventType)) {
      return new UXErrorStrategy();
    }

    if (isTechStrategy(eventType)) {
      return new TechStrategy();
    }

    return eventStrategy[eventType] || null;
  }
}

export default new PFEventStrategyFactory();
