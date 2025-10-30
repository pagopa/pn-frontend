import { PFEventsType } from '../../../models/PFEventsType';
import PFEventStrategyFactory from '../PFEventStrategyFactory';
import { KoErrorStrategy } from '../Strategies/KoErrorStrategy';
import { SendAcceptDelegationStrategy } from '../Strategies/SendAcceptDelegationStrategy';
import { SendActiveIOUxSuccessStrategy } from '../Strategies/SendActiveIOUxSuccessStrategy';
import { SendAddAddressStrategy } from '../Strategies/SendAddAddressStrategy';
import { SendAddContactScreenViewStrategy } from '../Strategies/SendAddContactScreenViewStrategy';
import { SendAddContactWithSourceActionStrategy } from '../Strategies/SendAddContactWithSourceActionStrategy';
import { SendAddCourtesyContactUXSuccessStrategy } from '../Strategies/SendAddCourtesyContactUXSuccessStrategy';
import { SendAddLegalContactUXSuccessStrategy } from '../Strategies/SendAddLegalContactUXSuccessStrategy';
import { SendAddMandateUXConversionStrategy } from '../Strategies/SendAddMandateUXConversionStrategy';
import { SendAddMandateUXSuccessStrategy } from '../Strategies/SendAddMandateUXSuccessStrategy';
import { SendAddSercqSendAddEmailStartStrategy } from '../Strategies/SendAddSercqSendAddEmailStartStrategy';
import { SendAddSercqSendAddSmsStartStrategy } from '../Strategies/SendAddSercqSendAddSmsStartStrategy';
import { SendAddSercqSendEnterFlowStrategy } from '../Strategies/SendAddSercqSendEnterFlowStrategy';
import { SendAddSercqSendUxConversionStrategy } from '../Strategies/SendAddSercqSendUxConversionStrategy';
import { SendAddSercqUxSuccessStrategy } from '../Strategies/SendAddSercqUxSuccessStrategy';
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
import { SendRemoveSercqSendSuccessStrategy } from '../Strategies/SendRemoveSercqSendSuccessStrategy';
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
import { UXPspActionStrategy } from '../Strategies/UXPspActionStrategy';
import { UXScreenViewStrategy } from '../Strategies/UXScreenViewStrategy';
import { UXConfirmStrategy } from '../Strategies/UxConfirmStrategy';
import { UxWithDigitalDomicileStateAndContactDetailsStrategy } from '../Strategies/UxWithDigitalDomicileStateAndContactDetailsStrategy';
import { UxWithDigitalDomicileStateStrategy } from '../Strategies/UxWithDigitalDomicileStateStrategy';

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

  it('should return sendAddContactWithSourceActionStrategy for add contacts action events', () => {
    const eventTypes = [
      PFEventsType.SEND_ADD_PEC_START,
      PFEventsType.SEND_ADD_EMAIL_START,
      PFEventsType.SEND_ADD_SMS_START,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(SendAddContactWithSourceActionStrategy);
    });
  });

  it('should return SendAddCourtesyContactUXSuccessStrategy for add courtesy contacts start events', () => {
    const eventTypes = [
      PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS,
      PFEventsType.SEND_ADD_SMS_UX_SUCCESS,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(
        SendAddCourtesyContactUXSuccessStrategy
      );
    });
  });

  it('should return SendAddLegalContactUXSuccessStrategy for add contacts action events', () => {
    const eventTypes = [PFEventsType.SEND_ADD_PEC_UX_SUCCESS];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(SendAddLegalContactUXSuccessStrategy);
    });
  });

  it('should return SendAddContactScreenViewStrategy for add contacts success events', () => {
    const eventTypes = [
      PFEventsType.SEND_ADD_SMS_UX_CONVERSION,
      PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION,
      PFEventsType.SEND_ADD_PEC_UX_CONVERSION,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(SendAddContactScreenViewStrategy);
    });
  });

  it('should return UXScreenViewStrategy for UX Screen View events', () => {
    const eventTypes = [
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
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(UXScreenViewStrategy);
    });
  });

  it('should return UXConfirmStrategy for UX Confirm events', () => {
    const eventTypes = [
      PFEventsType.SEND_ADD_SERCQ_SEND_CONNECT_IO_UX_SUCCESS,
      PFEventsType.SEND_ADD_SERCQ_SEND_REMOVE_IO_SUCCESS,
      PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_UX_SUCCESS,
      PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_UX_SUCCESS,
      PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_ADD_EMAIL_UX_SUCCESS,
      PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SERCQ_SEND_CHANGE_EMAIL_UX_SUCCESS,
    ];

    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(UXConfirmStrategy);
    });
  });

  it('should return UXActionStrategy for UX Action events', () => {
    const eventTypes = [
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
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(UXActionStrategy);
    });
  });

  it('should return UXPspActionStrategy for UX Psp Action events', () => {
    const eventTypes = [PFEventsType.SEND_START_PAYMENT];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(UXPspActionStrategy);
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

  it('should return UxWithDigitalDomicileStateAndContactDetailsStrategy for events with digital domicile state and contacts details', () => {
    const eventTypes = [
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
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(
        UxWithDigitalDomicileStateAndContactDetailsStrategy
      );
    });
  });

  it('should return KoErrorStrategy for KO Events', () => {
    const eventTypes = [
      PFEventsType.SEND_ADD_SERCQ_SEND_PEC_ERROR,
      PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_MANDATORY,
      PFEventsType.SEND_ADD_SERCQ_SEND_TOS_MANDATORY,
      PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_ERROR,
      PFEventsType.SEND_ADD_SERCQ_SEND_SMS_ERROR,
      PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SELECTION_MISSING,
      PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_TOS_MANDATORY,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(KoErrorStrategy);
    });
  });

  it('should return TechScreenViewStrategy for tech screen view events', () => {
    const eventTypes = [PFEventsType.SEND_NOTIFICATION_NOT_ALLOWED];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(TechScreenViewStrategy);
    });
  });

  it('should return SendAddSercqUxSuccessStrategy for sercq add ux success events', () => {
    const eventTypes = [
      PFEventsType.SEND_ADD_SERCQ_SEND_UX_SUCCESS,
      PFEventsType.SEND_ADD_SERCQ_SEND_PEC_UX_SUCCESS,
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(SendAddSercqUxSuccessStrategy);
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

  it('should return SendRemoveSercqSendSuccessStrategy for SEND_REMOVE_SERCQ_SEND_SUCCESS', () => {
    expect(factory.getStrategy(PFEventsType.SEND_REMOVE_SERCQ_SEND_SUCCESS)).toBeInstanceOf(
      SendRemoveSercqSendSuccessStrategy
    );
  });

  it('should return SendActiveIOUxSuccessStrategy for SEND_ACTIVE_IO_UX_SUCCESS', () => {
    expect(factory.getStrategy(PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS)).toBeInstanceOf(
      SendActiveIOUxSuccessStrategy
    );
  });

  it('should return SendAddSercqSendAddEmailStartStrategy for SEND_ADD_SERCQ_SEND_ADD_EMAIL_START event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_START)).toBeInstanceOf(
      SendAddSercqSendAddEmailStartStrategy
    );
  });

  it('should return SendAddSercqSendAddSmsStartStrategy for SEND_ADD_SERCQ_SEND_ADD_SMS_START event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_START)).toBeInstanceOf(
      SendAddSercqSendAddSmsStartStrategy
    );
  });

  it('should return SendAddSercqSendUxConversionStrategy for SEND_ADD_SERCQ_SEND_UX_CONVERSION event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_ADD_SERCQ_SEND_UX_CONVERSION)).toBeInstanceOf(
      SendAddSercqSendUxConversionStrategy
    );
  });

  it('should return SendAddSercqSendEnterFlowStrategy for SEND_ADD_SERCQ_SEND_ENTER_FLOW event', () => {
    expect(factory.getStrategy(PFEventsType.SEND_ADD_SERCQ_SEND_ENTER_FLOW)).toBeInstanceOf(
      SendAddSercqSendEnterFlowStrategy
    );
  });

  it('should return UxWithDigitalDomicileStateStrategy for UX Action events with digital domicile state', () => {
    const eventTypes = [
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
    ];
    eventTypes.forEach((eventType) => {
      expect(factory.getStrategy(eventType)).toBeInstanceOf(UxWithDigitalDomicileStateStrategy);
    });
  });

  it('should return null for unknown event type', () => {
    expect(factory.getStrategy('UNKNOWN_EVENT' as PFEventsType)).toBeNull();
  });
});
