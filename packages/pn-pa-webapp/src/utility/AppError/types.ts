/**
 * These codes have been retrived accessing the source code available
 * inside the exception package of every BE project on github.
 * Currently there's no centralized documentation that explains how
 * and under which circumstances a particular error is thrown.
 * Andrea Cimini 01.03.2023
 */
export enum ServerResponseErrorCode {
  PN_GENERIC_INVALIDPARAMETER = 'PN_GENERIC_INVALIDPARAMETER',
  PN_GENERIC_INVALIDPARAMETER_DUPLICATED = 'PN_GENERIC_INVALIDPARAMETER_DUPLICATED',
  PN_GENERIC_INVALIDPARAMETER_TAXONOMYCODE = 'PN_GENERIC_INVALIDPARAMETER_TAXONOMYCODE',
  PN_DELIVERY_NOTIFICATION_LIMIT_EXCEEDED = 'PN_DELIVERY_NOTIFICATION_LIMIT_EXCEEDED',
}
