export var ServerResponseErrorCode;
(function (ServerResponseErrorCode) {
    /**
     * Used by AppErrorFactory as default when the received error code
     * has no correspondent subtype to be mapped to
     */
    ServerResponseErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    // GENERIC ERROR
    ServerResponseErrorCode["BAD_REQUEST_ERROR"] = "BAD_REQUEST_ERROR";
    ServerResponseErrorCode["UNAUTHORIZED_ERROR"] = "UNAUTHORIZED_ERROR";
    ServerResponseErrorCode["FORBIDDEN_ERROR"] = "FORBIDDEN_ERROR";
    ServerResponseErrorCode["UNAVAILABLE_FOR_LEGAL_REASONS_ERROR"] = "UNAVAILABLE_FOR_LEGAL_REASONS_ERROR";
    ServerResponseErrorCode["NOT_FOUND_ERROR"] = "NOT_FOUND_ERROR";
    ServerResponseErrorCode["INTERNAL_SERVER_ERROR"] = "SERVER_ERROR";
    ServerResponseErrorCode["UNHANDLED_ERROR"] = "UNHANDLED_ERROR";
    ServerResponseErrorCode["GENERIC_ERROR"] = "GENERIC_ERROR";
})(ServerResponseErrorCode || (ServerResponseErrorCode = {}));
