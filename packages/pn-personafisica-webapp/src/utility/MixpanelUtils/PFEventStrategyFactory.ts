import { EventStrategy, EventStrategyFactory } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { SendAddContactActionStrategy } from './Strategies/SendAddContactActionStrategy';
import { SendAddContactScreenViewStrategy } from './Strategies/SendAddContactScreenViewStrategy';
import { SendAddMandateUXConversionStrategy } from './Strategies/SendAddMandateUXConversionStrategy';
import { SendAddMandateUXSuccessStrategy } from './Strategies/SendAddMandateUXSuccessStrategy';
import { SendDownloadCertificateOpposable } from './Strategies/SendDownloadCertificateOpposable';
import { SendDownloadResponseStrategy } from './Strategies/SendDownloadResponse';
import { SendGenericErrorStrategy } from './Strategies/SendGenericErrorStrategy';
import { SendHasAddressesStrategy } from './Strategies/SendHasAddressesStrategy';
import { SendHasMandateStrategy } from './Strategies/SendHasMandateStrategy';
import { SendMandateGivenStrategy } from './Strategies/SendMandateGivenStrategy';
import { SendNotificationCountStrategy } from './Strategies/SendNotificationCount';
import { SendNotificationDetailStrategy } from './Strategies/SendNotificationDetailStrategy';
import { SendNotificationStatusDetailStrategy } from './Strategies/SendNotificationStatusDetail';
import { SendPaymentDetailErrorStrategy } from './Strategies/SendPaymentDetailErrorStrategy';
import { SendPaymentOutcomeStrategy } from './Strategies/SendPaymentOutcomeStrategy';
import { SendPaymentStatusStrategy } from './Strategies/SendPaymentStatusStrategy';
import { SendPaymentsCountStrategy } from './Strategies/SendPaymentsCountStrategy';
import { SendRefreshPageStrategy } from './Strategies/SendRefreshPageStrategy';
import { SendRemoveContactSuccessStrategy } from './Strategies/SendRemoveContactSuccess';
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

// TODO: resolve the complexity and the max switch cases
class PFEventStrategyFactory extends EventStrategyFactory<PFEventsType> {
  // eslint-disable-next-line complexity
  getStrategy(eventType: PFEventsType): EventStrategy | null {
    // eslint-disable-next-line sonarjs/max-switch-cases
    switch (eventType) {
      case PFEventsType.SEND_VIEW_PROFILE:
        return new SendViewProfileStrategy();
      case PFEventsType.SEND_VIEW_CONTACT_DETAILS:
        return new SendViewContactDetailsStrategy();
      case PFEventsType.SEND_NOTIFICATION_DETAIL:
        return new SendNotificationDetailStrategy();
      case PFEventsType.SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES:
        return new SendDownloadCertificateOpposable();
      case PFEventsType.SEND_YOUR_NOTIFICATIONS:
      case PFEventsType.SEND_NOTIFICATION_DELEGATED:
        return new SendYourNotificationsStrategy();
      case PFEventsType.SEND_NOTIFICATION_STATUS_DETAIL:
        return new SendNotificationStatusDetailStrategy();
      case PFEventsType.SEND_YOUR_MANDATES:
        return new SendYourMandatesStrategy();
      case PFEventsType.SEND_ADD_MANDATE_UX_CONVERSION:
        return new SendAddMandateUXConversionStrategy();
      case PFEventsType.SEND_ADD_MANDATE_UX_SUCCESS:
        return new SendAddMandateUXSuccessStrategy();
      case PFEventsType.SEND_YOUR_CONTACT_DETAILS:
        return new SendYourContactDetailsStrategy();
      case PFEventsType.SEND_SERVICE_STATUS:
        return new SendServiceStatusStrategy();
      case PFEventsType.SEND_REFRESH_PAGE:
        return new SendRefreshPageStrategy();
      case PFEventsType.SEND_TOAST_ERROR:
        return new SendToastErrorStrategy();
      case PFEventsType.SEND_GENERIC_ERROR:
        return new SendGenericErrorStrategy();
      case PFEventsType.SEND_PAYMENT_OUTCOME:
        return new SendPaymentOutcomeStrategy();
      case PFEventsType.SEND_DOWNLOAD_RESPONSE:
        return new SendDownloadResponseStrategy();
      case PFEventsType.SEND_PAYMENT_STATUS:
        return new SendPaymentStatusStrategy();
      case PFEventsType.SEND_PAYMENT_DETAIL_ERROR:
        return new SendPaymentDetailErrorStrategy();

      case PFEventsType.SEND_REMOVE_EMAIL_SUCCESS:
      case PFEventsType.SEND_REMOVE_SMS_SUCCESS:
      case PFEventsType.SEND_REMOVE_PEC_SUCCESS:
        return new SendRemoveContactSuccessStrategy();

      case PFEventsType.SEND_ADD_EMAIL_START:
      case PFEventsType.SEND_ADD_SMS_START:
      case PFEventsType.SEND_ADD_PEC_START:
      case PFEventsType.SEND_ADD_PEC_UX_CONVERSION:
      case PFEventsType.SEND_ADD_SMS_UX_CONVERSION:
      case PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION:
        return new SendAddContactActionStrategy();

      case PFEventsType.SEND_ADD_PEC_UX_SUCCESS:
      case PFEventsType.SEND_ADD_SMS_UX_SUCCESS:
      case PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS:
        return new SendAddContactScreenViewStrategy();

      case PFEventsType.SEND_PROFILE:
      case PFEventsType.SEND_ADD_MANDATE_DATA_INPUT:
      case PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS:
      case PFEventsType.SEND_DEACTIVE_IO_UX_SUCCESS:
        return new UXScreenViewStrategy();

      case PFEventsType.SEND_DOWNLOAD_ATTACHMENT:
      case PFEventsType.SEND_DOWNLOAD_RECEIPT_NOTICE:
      case PFEventsType.SEND_START_PAYMENT:
      case PFEventsType.SEND_PAYMENT_DETAIL_REFRESH:
      case PFEventsType.SEND_ADD_MANDATE_START:
      case PFEventsType.SEND_ADD_MANDATE_BACK:
      case PFEventsType.SEND_SHOW_MANDATE_CODE:
      case PFEventsType.SEND_MANDATE_REVOKED:
      case PFEventsType.SEND_MANDATE_REJECTED:
      case PFEventsType.SEND_MANDATE_ACCEPTED:
      case PFEventsType.SEND_ACTIVE_IO_START:
      case PFEventsType.SEND_DEACTIVE_IO_START:
      case PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION:
      case PFEventsType.SEND_DEACTIVE_IO_UX_CONVERSION:
      case PFEventsType.SEND_CANCELLED_NOTIFICATION_REFOUND_INFO:
      case PFEventsType.SEND_MULTIPAYMENT_MORE_INFO:
      case PFEventsType.SEND_PAYMENT_LIST_CHANGE_PAGE:
      case PFEventsType.SEND_F24_DOWNLOAD:
      case PFEventsType.SEND_DOWNLOAD_PAYMENT_NOTICE:
        return new UXActionStrategy();

      case PFEventsType.SEND_MANDATE_ACCEPT_CODE_ERROR:
      case PFEventsType.SEND_ADD_PEC_CODE_ERROR:
      case PFEventsType.SEND_ADD_SMS_CODE_ERROR:
      case PFEventsType.SEND_ADD_EMAIL_CODE_ERROR:
        return new UXErrorStrategy();

      case PFEventsType.SEND_RAPID_ACCESS:
      case PFEventsType.SEND_AUTH_SUCCESS:
      case PFEventsType.SEND_F24_DOWNLOAD_SUCCESS:
      case PFEventsType.SEND_F24_DOWNLOAD_TIMEOUT:
        return new TechStrategy();

      case PFEventsType.SEND_NOTIFICATION_NOT_ALLOWED:
        return new TechScreenViewStrategy();

      case PFEventsType.SEND_HAS_ADDRESSES:
        return new SendHasAddressesStrategy();
      case PFEventsType.SEND_NOTIFICATIONS_COUNT:
        return new SendNotificationCountStrategy();
      case PFEventsType.SEND_PAYMENTS_COUNT:
        return new SendPaymentsCountStrategy();
      case PFEventsType.SEND_HAS_MANDATE:
        return new SendHasMandateStrategy();
      case PFEventsType.SEND_MANDATE_GIVEN:
        return new SendMandateGivenStrategy();
      default:
        return null;
    }
  }
}

export default new PFEventStrategyFactory();
