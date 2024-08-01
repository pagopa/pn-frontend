import { PFEventsType } from '../../../models/PFEventsType';
import PFEventStrategyFactory from '../PFEventStrategyFactory';
import { SendAcceptDelegationStrategy } from '../Strategies/SendAcceptDelegationStrategy';
import { SendAddAddressStrategy } from '../Strategies/SendAddAddressStrategy';
import { SendAddContactActionStrategy } from '../Strategies/SendAddContactActionStrategy';
import { SendAddContactScreenViewStrategy } from '../Strategies/SendAddContactScreenViewStrategy';
import { SendAddMandateUXConversionStrategy } from '../Strategies/SendAddMandateUXConversionStrategy';
import { SendAddMandateUXSuccessStrategy } from '../Strategies/SendAddMandateUXSuccessStrategy';
import { SendDisableIOStrategy } from '../Strategies/SendDisableIOStrategy';
import { SendDownloadCertificateOpposable } from '../Strategies/SendDownloadCertificateOpposable';
import { SendDownloadResponseStrategy } from '../Strategies/SendDownloadResponse';
import { SendEnableIOStrategy } from '../Strategies/SendEnableIOStrategy';
import { SendGenericErrorStrategy } from '../Strategies/SendGenericErrorStrategy';
import { SendHasAddressesStrategy } from '../Strategies/SendHasAddressesStrategy';
import { SendHasMandateGivenStrategy } from '../Strategies/SendHasMandateGivensStrategy';
import { SendHasMandateLoginStrategy } from '../Strategies/SendHasMandateLoginStrategy';
import { SendHasMandateStrategy } from '../Strategies/SendHasMandateStrategy';
import { SendNotificationCountStrategy } from '../Strategies/SendNotificationCount';
import { SendNotificationStatusDetailStrategy } from '../Strategies/SendNotificationStatusDetail';
import { SendPaymentDetailErrorStrategy } from '../Strategies/SendPaymentDetailErrorStrategy';
import { SendPaymentOutcomeStrategy } from '../Strategies/SendPaymentOutcomeStrategy';
import { SendPaymentStatusStrategy } from '../Strategies/SendPaymentStatusStrategy';
import { SendPaymentsCountStrategy } from '../Strategies/SendPaymentsCountStrategy';
import { SendRefreshPageStrategy } from '../Strategies/SendRefreshPageStrategy';
import { SendRemoveAddressStrategy } from '../Strategies/SendRemoveAddressStrategy';
import { SendRemoveContactSuccessStrategy } from '../Strategies/SendRemoveContactSuccess';
import { SendServiceStatusStrategy } from '../Strategies/SendServiceStatusStrategy';
import { SendToastErrorStrategy } from '../Strategies/SendToastErrorStrategy';
import { SendViewContactDetailsStrategy } from '../Strategies/SendViewContactDetailsStrategy';
import { SendViewProfileStrategy } from '../Strategies/SendViewProfileStrategy';
import { SendYourContactDetailsStrategy } from '../Strategies/SendYourContactDetailsStrategy';
import { SendYourMandatesStrategy } from '../Strategies/SendYourMandatesStrategy';
import { SendYourNotificationsStrategy } from '../Strategies/SendYourNotificationsStrategy';
import { TechScreenViewStrategy } from '../Strategies/TechScreenViewStrategy';
import { TechStrategy } from '../Strategies/TechStrategy';
import { UXActionStrategy } from '../Strategies/UXActionStrategy';
import { UXErrorStrategy } from '../Strategies/UXErrorStrategy';
import { UXScreenViewStrategy } from '../Strategies/UXScreenViewStrategy';

describe('Event Strategy Factory', () => {
  const factory = PFEventStrategyFactory;

  it('should return SendViewProfileStrategy for SEND_VIEW_PROFILE event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_VIEW_PROFILE)).toBeInstanceOf(
      SendViewProfileStrategy
    );
  });

  it('should return SendViewContactDetailsStrategy for SEND_VIEW_CONTACT_DETAILS event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_VIEW_CONTACT_DETAILS)).toBeInstanceOf(
      SendViewContactDetailsStrategy
    );
  });

  it('should return SendDownloadCertificateOpposable for SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES event', () => {
    expect(
      factory.getStrategy(PFEventsType.SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES)
    ).toBeInstanceOf(SendDownloadCertificateOpposable);
  });

  it('should return SendYourNotificationsStrategy for SEND_YOUR_NOTIFICATIONS and SEND_NOTIFICATION_DELEGATED', () => {
    const eventTypes = [
      PFEventsType.SEND_YOUR_NOTIFICATIONS,
      PFEventsType.SEND_NOTIFICATION_DELEGATED,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(SendYourNotificationsStrategy);
    });
  });

  it('should return SendNotificationStatusDetailStrategy for SEND_NOTIFICATION_STATUS_DETAIL event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_NOTIFICATION_STATUS_DETAIL)).toBeInstanceOf(
      SendNotificationStatusDetailStrategy
    );
  });

  it('should return SendYourMandatesStrategy for SEND_YOUR_MANDATES event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_YOUR_MANDATES)).toBeInstanceOf(
      SendYourMandatesStrategy
    );
  });

  it('should return SendAddMandateUXConversionStrategy for SEND_ADD_MANDATE_UX_CONVERSION event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_ADD_MANDATE_UX_CONVERSION)).toBeInstanceOf(
      SendAddMandateUXConversionStrategy
    );
  });

  it('should return SendAddMandateUXSuccessStrategy for SEND_ADD_MANDATE_UX_SUCCESS event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_ADD_MANDATE_UX_SUCCESS)).toBeInstanceOf(
      SendAddMandateUXSuccessStrategy
    );
  });

  it('should return SendYourContactDetailsStrategy for SEND_YOUR_CONTACT_DETAILS event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_YOUR_CONTACT_DETAILS)).toBeInstanceOf(
      SendYourContactDetailsStrategy
    );
  });

  it('should return SendServiceStatusStrategy for SEND_SERVICE_STATUS event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_SERVICE_STATUS)).toBeInstanceOf(
      SendServiceStatusStrategy
    );
  });

  it('should return SendRefreshPageStrategy for SEND_REFRESH_PAGE event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_REFRESH_PAGE)).toBeInstanceOf(
      SendRefreshPageStrategy
    );
  });

  it('should return SendToastErrorStrategy for SEND_TOAST_ERROR event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_TOAST_ERROR)).toBeInstanceOf(
      SendToastErrorStrategy
    );
  });

  it('should return SendGenericErrorStrategy for SEND_GENERIC_ERROR event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_GENERIC_ERROR)).toBeInstanceOf(
      SendGenericErrorStrategy
    );
  });

  it('should return SendPaymentOutcomeStrategy for SEND_PAYMENT_OUTCOME event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_PAYMENT_OUTCOME)).toBeInstanceOf(
      SendPaymentOutcomeStrategy
    );
  });

  it('should return SendDownloadResponseStrategy for SEND_DOWNLOAD_RESPONSE event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_DOWNLOAD_RESPONSE)).toBeInstanceOf(
      SendDownloadResponseStrategy
    );
  });

  it('should return SendPaymentStatusStrategy for SEND_PAYMENT_STATUS event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_PAYMENT_STATUS)).toBeInstanceOf(
      SendPaymentStatusStrategy
    );
  });

  it('should return SendPaymentDetailErrorStrategy for SEND_PAYMENT_DETAIL_ERROR event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_PAYMENT_DETAIL_ERROR)).toBeInstanceOf(
      SendPaymentDetailErrorStrategy
    );
  });

  it('should return SendRemoveContactSuccessStrategy for remove contacts success events', () => {
    const eventTypes = [
      PFEventsType.SEND_REMOVE_EMAIL_SUCCESS,
      PFEventsType.SEND_REMOVE_SMS_SUCCESS,
      PFEventsType.SEND_REMOVE_PEC_SUCCESS,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(SendRemoveContactSuccessStrategy);
    });
  });

  it('should return SendAddContactActionStrategy for add contacts start events', () => {
    const eventTypes = [
      PFEventsType.SEND_ADD_EMAIL_START,
      PFEventsType.SEND_ADD_SMS_START,
      PFEventsType.SEND_ADD_PEC_START,
      PFEventsType.SEND_ADD_PEC_UX_CONVERSION,
      PFEventsType.SEND_ADD_SMS_UX_CONVERSION,
      PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(SendAddContactActionStrategy);
    });
  });

  it('should return SendAddContactScreenViewStrategy for add contacts success events', () => {
    const eventTypes = [
      PFEventsType.SEND_ADD_PEC_UX_SUCCESS,
      PFEventsType.SEND_ADD_SMS_UX_SUCCESS,
      PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(SendAddContactScreenViewStrategy);
    });
  });

  it('should return UXScreenViewStrategy for UX Screen View events', () => {
    const eventTypes = [
      PFEventsType.SEND_PROFILE,
      PFEventsType.SEND_ADD_MANDATE_DATA_INPUT,
      PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS,
      PFEventsType.SEND_DEACTIVE_IO_UX_SUCCESS,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(UXScreenViewStrategy);
    });
  });

  it('should return UXActionStrategy for UX Action events', () => {
    const eventTypes = [
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
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(UXActionStrategy);
    });
  });

  it('should return UXErrorStrategy for UX Error events', () => {
    const eventTypes = [
      PFEventsType.SEND_MANDATE_ACCEPT_CODE_ERROR,
      PFEventsType.SEND_ADD_PEC_CODE_ERROR,
      PFEventsType.SEND_ADD_SMS_CODE_ERROR,
      PFEventsType.SEND_ADD_EMAIL_CODE_ERROR,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(UXErrorStrategy);
    });
  });

  it('should return TechStrategy for tech events', () => {
    const eventTypes = [
      PFEventsType.SEND_RAPID_ACCESS,
      PFEventsType.SEND_AUTH_SUCCESS,
      PFEventsType.SEND_F24_DOWNLOAD_SUCCESS,
      PFEventsType.SEND_F24_DOWNLOAD_TIMEOUT,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(TechStrategy);
    });
  });

  it('should return TechScreenViewStrategy for tech screen view events', () => {
    const eventTypes = [PFEventsType.SEND_NOTIFICATION_NOT_ALLOWED];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(TechScreenViewStrategy);
    });
  });

  it('should return SendHasAddressesStrategy for SEND_HAS_ADDRESSES event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_HAS_ADDRESSES)).toBeInstanceOf(
      SendHasAddressesStrategy
    );
  });

  it('should return SendHasMandateGivenStrategy for SEND_HAS_MANDATE_LOGIN event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_HAS_MANDATE_LOGIN)).toBeInstanceOf(
      SendHasMandateLoginStrategy
    );
  });

  it('should return SendMandateGivenStrategy for SEND_MANDATE_GIVEN event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_MANDATE_GIVEN)).toBeInstanceOf(
      SendHasMandateGivenStrategy
    );
  });

  it('should return SendHasMandateStrategy for SEND_HAS_MANDATE event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_HAS_MANDATE)).toBeInstanceOf(
      SendHasMandateStrategy
    );
  });

  it('should return SendDisableIOStrategy for SEND_DISABLE_IO event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_DISABLE_IO)).toBeInstanceOf(SendDisableIOStrategy);
  });

  it('should return SendEnableIOStrategy for SEND_ENABLE_IO event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_ENABLE_IO)).toBeInstanceOf(SendEnableIOStrategy);
  });

  it('should return SendAcceptDelegationStrategy for SEND_ACCEPT_DELEGATION event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_ACCEPT_DELEGATION)).toBeInstanceOf(
      SendAcceptDelegationStrategy
    );
  });

  it('should return SendRemoveLegalAddressStrategy for SEND_DELETE_ADDRESS event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_DELETE_ADDRESS)).toBeInstanceOf(
      SendRemoveAddressStrategy
    );
  });

  it('should return SendAddLegalAddressStrategy for SEND_ADD_LEGAL_ADDRESS event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_ADD_ADDRESS)).toBeInstanceOf(
      SendAddAddressStrategy
    );
  });

  it('should return SendNotificationCountStrategy for SEND_NOTIFICATIONS_COUNT event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_NOTIFICATIONS_COUNT)).toBeInstanceOf(
      SendNotificationCountStrategy
    );
  });

  it('should return SendPaymentsCountStrategy for SEND_PAYMENTS_COUNT event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_PAYMENTS_COUNT)).toBeInstanceOf(
      SendPaymentsCountStrategy
    );
  });

  it('should return null for unknown event type', () => {
    expect(factory.getStrategy('UNKNOWN_EVENT' as PFEventsType)).toBeNull();
  });
});
