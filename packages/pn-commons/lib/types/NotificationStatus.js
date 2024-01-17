export var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["IN_VALIDATION"] = "IN_VALIDATION";
    NotificationStatus["ACCEPTED"] = "ACCEPTED";
    NotificationStatus["DELIVERING"] = "DELIVERING";
    NotificationStatus["DELIVERED"] = "DELIVERED";
    NotificationStatus["VIEWED"] = "VIEWED";
    NotificationStatus["EFFECTIVE_DATE"] = "EFFECTIVE_DATE";
    NotificationStatus["PAID"] = "PAID";
    NotificationStatus["UNREACHABLE"] = "UNREACHABLE";
    NotificationStatus["CANCELLED"] = "CANCELLED";
    NotificationStatus["REFUSED"] = "REFUSED";
    // only fe
    NotificationStatus["CANCELLATION_IN_PROGRESS"] = "CANCELLATION_IN_PROGRESS";
})(NotificationStatus || (NotificationStatus = {}));
