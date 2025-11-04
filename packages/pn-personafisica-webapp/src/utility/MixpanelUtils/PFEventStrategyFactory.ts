import { EventStrategy, EventStrategyFactory } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { KoErrorStrategy } from './Strategies/KoErrorStrategy';
import { SendAcceptDelegationStrategy } from './Strategies/SendAcceptDelegationStrategy';
import { SendActiveIOUxSuccessStrategy } from './Strategies/SendActiveIOUxSuccessStrategy';
import { SendAddAddressStrategy } from './Strategies/SendAddAddressStrategy';
import { SendAddContactScreenViewStrategy } from './Strategies/SendAddContactScreenViewStrategy';
import { SendAddContactWithSourceActionStrategy } from './Strategies/SendAddContactWithSourceActionStrategy';
import { SendAddCourtesyContactUXSuccessStrategy } from './Strategies/SendAddCourtesyContactUXSuccessStrategy';
import { SendAddLegalContactUXSuccessStrategy } from './Strategies/SendAddLegalContactUXSuccessStrategy';
import { SendAddMandateUXConversionStrategy } from './Strategies/SendAddMandateUXConversionStrategy';
import { SendAddMandateUXSuccessStrategy } from './Strategies/SendAddMandateUXSuccessStrategy';
import { SendAddSercqPecStartActivationStrategy } from './Strategies/SendAddSercqPecStartActivationStrategy';
import { SendAddSercqSendAddEmailStartStrategy } from './Strategies/SendAddSercqSendAddEmailStartStrategy';
import { SendAddSercqSendAddSmsStartStrategy } from './Strategies/SendAddSercqSendAddSmsStartStrategy';
import { SendAddSercqSendEnterFlowStrategy } from './Strategies/SendAddSercqSendEnterFlowStrategy';
import { SendAddSercqSendUxConversionStrategy } from './Strategies/SendAddSercqSendUxConversionStrategy';
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
import { SendRemoveAddressStrategy } from './Strategies/SendRemoveAddressStrategy';
import { SendRemoveContactSuccessStrategy } from './Strategies/SendRemoveContactSuccess';
import { SendRemoveSercqSendSuccessStrategy } from './Strategies/SendRemoveSercqSendSuccessStrategy';
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
import { UXPspActionStrategy } from './Strategies/UXPspActionStrategy';
import { UXScreenViewStrategy } from './Strategies/UXScreenViewStrategy';
import { UXConfirmStrategy } from './Strategies/UxConfirmStrategy';
import { UxWithContactDetailsAndOtherContactStrategy } from './Strategies/UxWithContactDetailsAndOtherContactStrategy';
import { UxWithDDStateContactDetailsAndOtherContactStrategy } from './Strategies/UxWithDDStateContactDetailsAndOtherContactStrategy';
import { UxWithDDStateContactDetailsCustomizedContactTypeStrategy } from './Strategies/UxWithDDStateContactDetailsCustomizedContactTypeStrategy';
import { UxWithDDStateSourceAndOtherContactStrategy } from './Strategies/UxWithDDStateSourceAndOtherContactStrategy';
import { UxWithDDStateTosAndPecValidationStrategy } from './Strategies/UxWithDDStateTosAndPecValidationStrategy';
import { UxWithDigitalDomicileStateAndContactDetailsStrategy } from './Strategies/UxWithDigitalDomicileStateAndContactDetailsStrategy';
import { UxWithDigitalDomicileStateStrategy } from './Strategies/UxWithDigitalDomicileStateStrategy';

const uxActionStrategy = [
  PFEventsType.SEND_DOWNLOAD_ATTACHMENT,
  PFEventsType.SEND_DOWNLOAD_RECEIPT_NOTICE,
  PFEventsType.SEND_PAYMENT_DETAIL_REFRESH,
  PFEventsType.SEND_ADD_MANDATE_START,
  PFEventsType.SEND_ADD_MANDATE_BACK,
  PFEventsType.SEND_SHOW_MANDATE_CODE,
  PFEventsType.SEND_MANDATE_REVOKED,
  PFEventsType.SEND_MANDATE_REJECTED,
  PFEventsType.SEND_MANDATE_ACCEPTED,
  PFEventsType.SEND_ACTIVE_IO_START,
  PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION,
  PFEventsType.SEND_CANCELLED_NOTIFICATION_REFOUND_INFO,
  PFEventsType.SEND_MULTIPAYMENT_MORE_INFO,
  PFEventsType.SEND_PAYMENT_LIST_CHANGE_PAGE,
  PFEventsType.SEND_F24_DOWNLOAD,
  PFEventsType.SEND_DOWNLOAD_PAYMENT_NOTICE,
  PFEventsType.SEND_ADD_SERCQ_SEND_CANCEL,
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_BACK,
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_ACCEPTED,
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_DISMISSED,
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_OTP_BACK,
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_UX_CONVERSION,
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_THANK_YOU_PAGE_CLOSE,
  PFEventsType.SEND_ADD_SERCQ_SEND_APP_IO_BACK,
  PFEventsType.SEND_ADD_SERCQ_SEND_CONTINUE_WITHOUT_IO,
  PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_APP_IO_CONNECT,
  PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_APP_IO_DECLINED,
  PFEventsType.SEND_ADD_SERCQ_SEND_REMOVE_IO,
  PFEventsType.SEND_ADD_SERCQ_SEND_APP_IO_NEXT_STEP,
  PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO_CONFIRM,
  PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO_BACK,
  PFEventsType.SEND_ADD_SERCQ_SEND_CONNECT_IO_UX_CONVERSION,
  PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO_DISCONNECT,
  PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO_CANCEL,
  PFEventsType.SEND_ADD_SERCQ_SEND_CONNECT_IO_UX_CONVERSION,
  PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_SMS_BACK,
  PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_UX_CONVERSION,
  PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_BACK,
  PFEventsType.SEND_ADD_SERCQ_SEND_CHANGE_EMAIL,
  PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS,
  PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_CANCEL,
  PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_BACK,
  PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_UX_CONVERSION,
  PFEventsType.SEND_ADD_SERCQ_SEND_CHANGE_SMS,
  PFEventsType.SEND_ADD_SERCQ_SEND_SUMMARY_BACK,
  PFEventsType.SEND_ADD_SERCQ_SEND_GO_TO_SMS,
  PFEventsType.SEND_ADD_SERCQ_SEND_GO_TO_EMAIL,
  PFEventsType.SEND_ADD_SERCQ_SEND_GO_TO_APP_IO,
  PFEventsType.SEND_ADD_SERCQ_SEND_SUMMARY_TOS_ACCEPTED,
  PFEventsType.SEND_ADD_SERCQ_SEND_SUMMARY_TOS_DISMISSED,
  PFEventsType.SEND_ADD_SERCQ_SEND_THANK_YOU_PAGE_CLOSE,
  PFEventsType.SEND_ACTIVE_IO_CANCEL,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_BACK,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_START,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_UX_CONVERSION,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_BACK,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_CANCEL,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_CONTINUE,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_START,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_UX_CONVERSION,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_THANK_YOU_PAGE_CLOSE,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_TOS_ACCEPTED,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_TOS_DISMISSEDD,
  PFEventsType.SEND_ADD_EMAIL_BACK,
  PFEventsType.SEND_ADD_SMS_BACK,
  PFEventsType.SEND_CHANGE_EMAIL_BACK,
  PFEventsType.SEND_CHANGE_EMAIL_CANCEL,
  PFEventsType.SEND_CHANGE_EMAIL_CONTINUE,
  PFEventsType.SEND_CHANGE_EMAIL_START,
  PFEventsType.SEND_CHANGE_EMAIL_UX_CONVERSION,
  PFEventsType.SEND_CHANGE_SMS_BACK,
  PFEventsType.SEND_CHANGE_SMS_CANCEL,
  PFEventsType.SEND_CHANGE_SMS_CONTINUE,
  PFEventsType.SEND_CHANGE_SMS_START,
  PFEventsType.SEND_CHANGE_SMS_UX_CONVERSION,
  PFEventsType.SEND_PEC_CANCEL_VALIDATION,
  PFEventsType.SEND_PEC_CANCEL_VALIDATION_CANCEL,
  PFEventsType.SEND_PEC_CANCEL_VALIDATION_CONFIRM,
] as const;

const uxPspActionStrategy = [PFEventsType.SEND_START_PAYMENT] as const;

const sendAddContactWithSourceActionStrategy = [
  PFEventsType.SEND_ADD_PEC_START,
  PFEventsType.SEND_ADD_EMAIL_START,
  PFEventsType.SEND_ADD_SMS_START,
];

const sendAddLegalContactUXSuccessStrategy = [PFEventsType.SEND_ADD_PEC_UX_SUCCESS] as const;

const sendAddCourtesyContactUXSuccessStrategy = [
  PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS,
  PFEventsType.SEND_ADD_SMS_UX_SUCCESS,
] as const;

const sendRemoveContactSuccessStrategy = [
  PFEventsType.SEND_REMOVE_EMAIL_SUCCESS,
  PFEventsType.SEND_REMOVE_SMS_SUCCESS,
  PFEventsType.SEND_REMOVE_PEC_SUCCESS,
] as const;

const sendAddContactScreenViewStrategy = [
  PFEventsType.SEND_ADD_SMS_UX_CONVERSION,
  PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION,
  PFEventsType.SEND_ADD_PEC_UX_CONVERSION,
] as const;

const uxScreenViewStrategy = [
  PFEventsType.SEND_PROFILE,
  PFEventsType.SEND_ADD_MANDATE_DATA_INPUT,
  PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP,
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_OTP,
  PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_APP_IO,
  PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO,
  PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_OTP,
  PFEventsType.SEND_ADD_SERCQ_SEND_SMS_OTP,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_OTP,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_OTP,
  PFEventsType.SEND_ADD_EMAIL_OTP,
  PFEventsType.SEND_ADD_SMS_OTP,
  PFEventsType.SEND_CHANGE_EMAIL_OTP,
  PFEventsType.SEND_CHANGE_EMAIL_UX_SUCCESS,
  PFEventsType.SEND_CHANGE_SMS_OTP,
  PFEventsType.SEND_CHANGE_SMS_UX_SUCCESS,
  PFEventsType.SEND_PEC_CANCEL_VALIDATION_POP_UP,
] as const;

const uxConfirmStrategy = [
  PFEventsType.SEND_ADD_SERCQ_SEND_CONNECT_IO_UX_SUCCESS,
  PFEventsType.SEND_ADD_SERCQ_SEND_REMOVE_IO_SUCCESS,
  PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_UX_SUCCESS,
  PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_UX_SUCCESS,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_UX_SUCCESS,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_UX_SUCCESS,
] as const;

const uxErrorStrategy = [
  PFEventsType.SEND_MANDATE_ACCEPT_CODE_ERROR,
  PFEventsType.SEND_ADD_PEC_CODE_ERROR,
  PFEventsType.SEND_ADD_SMS_CODE_ERROR,
  PFEventsType.SEND_ADD_EMAIL_CODE_ERROR,
] as const;

const techStrategy = [
  PFEventsType.SEND_RAPID_ACCESS,
  PFEventsType.SEND_AUTH_SUCCESS,
  PFEventsType.SEND_F24_DOWNLOAD_SUCCESS,
  PFEventsType.SEND_F24_DOWNLOAD_TIMEOUT,
] as const;

const koErrorStrategy = [
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_ERROR,
  PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_ERROR,
  PFEventsType.SEND_ADD_SERCQ_SEND_SMS_ERROR,
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_MANDATORY,
  PFEventsType.SEND_ADD_SERCQ_SEND_TOS_MANDATORY,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SELECTION_MISSING,
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_TOS_MANDATORY,
] as const;

const uxWithDigitalDomicileStateStrategy = [
  PFEventsType.SEND_ADD_SERCQ_SEND_APP_IO,
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_ENTER_PEC,
  PFEventsType.SEND_DEACTIVE_IO_CANCEL,
  PFEventsType.SEND_DEACTIVE_IO_POP_UP,
  PFEventsType.SEND_DEACTIVE_IO_START,
  PFEventsType.SEND_DEACTIVE_IO_UX_CONVERSION,
  PFEventsType.SEND_DEACTIVE_IO_UX_SUCCESS,
  PFEventsType.SEND_DIGITAL_DOMICILE_MANAGEMENT,
  PFEventsType.SEND_MANAGE_DIGITAL_DOMICILE,
  PFEventsType.SEND_REMOVE_EMAIL_AND_SERCQ_CANCEL,
  PFEventsType.SEND_REMOVE_EMAIL_AND_SERCQ_POP_UP,
  PFEventsType.SEND_REMOVE_EMAIL_AND_SERCQ_POP_UP_CONTINUE,
  PFEventsType.SEND_REMOVE_EMAIL_AND_SERCQ_UX_SUCCESS,
  PFEventsType.SEND_REMOVE_EMAIL_POP_UP,
  PFEventsType.SEND_REMOVE_EMAIL_POP_UP_CANCEL,
  PFEventsType.SEND_REMOVE_EMAIL_POP_UP_CONTINUE,
  PFEventsType.SEND_REMOVE_EMAIL_START,
  PFEventsType.SEND_REMOVE_EMAIL_UX_SUCCESS,
  PFEventsType.SEND_REMOVE_SMS_POP_UP,
  PFEventsType.SEND_REMOVE_SMS_POP_UP_CANCEL,
  PFEventsType.SEND_REMOVE_SMS_POP_UP_CONTINUE,
  PFEventsType.SEND_REMOVE_SMS_POP_UP_UX_SUCCESS,
  PFEventsType.SEND_REMOVE_SMS_START,
] as const;

const uxWithDigitalDomicileStateAndContactDetailsStrategy = [
  PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT,
  PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_SMS,
  PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_SMS_CONTINUE,
  PFEventsType.SEND_ADD_SERCQ_SEND_INTRO,
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_START,
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_THANK_YOU_PAGE,
  PFEventsType.SEND_ADD_SERCQ_SEND_START,
  PFEventsType.SEND_ADD_SERCQ_SEND_SUMMARY,
  PFEventsType.SEND_ADD_SERCQ_SEND_THANK_YOU_PAGE,
  PFEventsType.SEND_CUSTOMIZE_CONTACT,
] as const;

const uxWithContactDetailsAndOtherContactStrategy = [
  PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP,
  PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CANCEL,
  PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_POP_UP_CONTINUE,
  PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_START,
  PFEventsType.SEND_REMOVE_DIGITAL_DOMICILE_PEC_UX_SUCCESS,
  PFEventsType.SEND_REMOVE_SERCQ_SEND_POP_UP,
  PFEventsType.SEND_REMOVE_SERCQ_SEND_POP_UP_CANCEL,
  PFEventsType.SEND_REMOVE_SERCQ_SEND_POP_UP_CONTINUE,
  PFEventsType.SEND_REMOVE_SERCQ_SEND_START,
  PFEventsType.SEND_REMOVE_SERCQ_SEND_UX_SUCCESS,
] as const;

const uxWithDDStateSourceAndOtherContactStrategy = [
  PFEventsType.SEND_ADD_SERCQ_SEND_ENTER_FLOW,
] as const;

const uxWithDDStateTosAndPecValidationStrategy = [
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_START_ACTIVATION,
] as const;

const uxWithDDStateContactDetailsAndOtherContactStrategy = [
  PFEventsType.SEND_ADD_SERCQ_SEND_PEC_UX_SUCCESS,
  PFEventsType.SEND_ADD_SERCQ_SEND_UX_SUCCESS,
] as const;

const uxWithDDStateContactDetailsCustomizedContactTypeStrategy = [
  PFEventsType.SEND_CUSTOMIZED_CONTACT_SERCQ_SEND_EMAIL_POP_UP,
  PFEventsType.SEND_CUSTOMIZED_CONTACT_SERCQ_SEND_EMAIL_POP_UP_CONTINUE,
] as const;

type ArrayToTuple<T extends ReadonlyArray<PFEventsType>> = keyof {
  [K in T extends ReadonlyArray<infer U> ? U : never]: string;
};

const eventStrategy: Record<
  Exclude<
    PFEventsType,
    | ArrayToTuple<typeof uxActionStrategy>
    | ArrayToTuple<typeof sendAddContactWithSourceActionStrategy>
    | ArrayToTuple<typeof sendAddLegalContactUXSuccessStrategy>
    | ArrayToTuple<typeof sendRemoveContactSuccessStrategy>
    | ArrayToTuple<typeof sendAddContactScreenViewStrategy>
    | ArrayToTuple<typeof uxScreenViewStrategy>
    | ArrayToTuple<typeof uxConfirmStrategy>
    | ArrayToTuple<typeof uxErrorStrategy>
    | ArrayToTuple<typeof techStrategy>
    | ArrayToTuple<typeof koErrorStrategy>
    | ArrayToTuple<typeof uxWithDDStateContactDetailsAndOtherContactStrategy>
    | ArrayToTuple<typeof uxWithDigitalDomicileStateStrategy>
  >,
  EventStrategy
> = {
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
  [PFEventsType.SEND_NOTIFICATIONS_COUNT]: new SendNotificationCountStrategy(),
  [PFEventsType.SEND_PAYMENTS_COUNT]: new SendPaymentsCountStrategy(),
  [PFEventsType.SEND_ADD_ADDRESS]: new SendAddAddressStrategy(),
  [PFEventsType.SEND_DELETE_ADDRESS]: new SendRemoveAddressStrategy(),
  [PFEventsType.SEND_REMOVE_SERCQ_SEND_SUCCESS]: new SendRemoveSercqSendSuccessStrategy(),
  [PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS]: new SendActiveIOUxSuccessStrategy(),
  [PFEventsType.SEND_ADD_SERCQ_SEND_PEC_START_ACTIVATION]:
    new SendAddSercqPecStartActivationStrategy(),
  [PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_START]: new SendAddSercqSendAddEmailStartStrategy(),
  [PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_START]: new SendAddSercqSendAddSmsStartStrategy(),
  [PFEventsType.SEND_ADD_SERCQ_SEND_UX_CONVERSION]: new SendAddSercqSendUxConversionStrategy(),
  [PFEventsType.SEND_ADD_SERCQ_SEND_ENTER_FLOW]: new SendAddSercqSendEnterFlowStrategy(),
};

const isInEventStrategyMap = (value: PFEventsType): value is keyof typeof eventStrategy => {
  if (Object.keys(eventStrategy).includes(value)) {
    return true;
  }
  return false;
};

class PFEventStrategyFactory extends EventStrategyFactory<PFEventsType> {
  // eslint-disable-next-line sonarjs/cognitive-complexity, complexity
  getStrategy(eventType: PFEventsType): EventStrategy | null {
    if (uxActionStrategy.findIndex((el) => el === eventType) > -1) {
      return new UXActionStrategy();
    }

    if (uxPspActionStrategy.findIndex((el) => el === eventType) > -1) {
      return new UXPspActionStrategy();
    }

    if (sendAddLegalContactUXSuccessStrategy.findIndex((el) => el === eventType) > -1) {
      return new SendAddLegalContactUXSuccessStrategy();
    }

    if (sendAddCourtesyContactUXSuccessStrategy.findIndex((el) => el === eventType) > -1) {
      return new SendAddCourtesyContactUXSuccessStrategy();
    }

    if (sendRemoveContactSuccessStrategy.findIndex((el) => el === eventType) > -1) {
      return new SendRemoveContactSuccessStrategy();
    }

    if (sendAddContactWithSourceActionStrategy.findIndex((el) => el === eventType) > -1) {
      return new SendAddContactWithSourceActionStrategy();
    }

    if (sendAddContactScreenViewStrategy.findIndex((el) => el === eventType) > -1) {
      return new SendAddContactScreenViewStrategy();
    }

    if (uxScreenViewStrategy.findIndex((el) => el === eventType) > -1) {
      return new UXScreenViewStrategy();
    }

    if (uxConfirmStrategy.findIndex((el) => el === eventType) > -1) {
      return new UXConfirmStrategy();
    }

    if (uxErrorStrategy.findIndex((el) => el === eventType) > -1) {
      return new UXErrorStrategy();
    }

    if (techStrategy.findIndex((el) => el === eventType) > -1) {
      return new TechStrategy();
    }

    if (koErrorStrategy.findIndex((el) => el === eventType) > -1) {
      return new KoErrorStrategy();
    }

    if (uxWithDigitalDomicileStateStrategy.findIndex((el) => el === eventType) > -1) {
      return new UxWithDigitalDomicileStateStrategy();
    }

    if (
      uxWithDigitalDomicileStateAndContactDetailsStrategy.findIndex((el) => el === eventType) > -1
    ) {
      return new UxWithDigitalDomicileStateAndContactDetailsStrategy();
    }

    if (uxWithContactDetailsAndOtherContactStrategy.findIndex((el) => el === eventType) > -1) {
      return new UxWithContactDetailsAndOtherContactStrategy();
    }

    if (
      uxWithDDStateContactDetailsCustomizedContactTypeStrategy.findIndex((el) => el === eventType) >
      -1
    ) {
      return new UxWithDDStateContactDetailsCustomizedContactTypeStrategy();
    }

    if (uxWithDDStateSourceAndOtherContactStrategy.findIndex((el) => el === eventType) > -1) {
      return new UxWithDDStateSourceAndOtherContactStrategy();
    }

    if (uxWithDDStateTosAndPecValidationStrategy.findIndex((el) => el === eventType) > -1) {
      return new UxWithDDStateTosAndPecValidationStrategy();
    }

    if (
      uxWithDDStateContactDetailsAndOtherContactStrategy.findIndex((el) => el === eventType) > -1
    ) {
      return new UxWithDDStateContactDetailsAndOtherContactStrategy();
    }

    if (isInEventStrategyMap(eventType)) {
      return eventStrategy[eventType];
    }
    return null;
  }
}

export default new PFEventStrategyFactory();
