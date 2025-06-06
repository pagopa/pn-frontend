/**
 * These codes have been retrived accessing the source code available
 * inside the exception package of every BE project on github.
 * Currently there's no centralized documentation that explains how
 * and under which circumstances a particular error is thrown.
 * Maurizio Flauti 22.09.2022
 */
export enum ServerResponseErrorCode {
  PN_MANDATE_NOTFOUND = 'PN_MANDATE_NOTFOUND',
  PN_MANDATE_ALREADYEXISTS = 'PN_MANDATE_ALREADYEXISTS',
  PN_MANDATE_NOTACCEPTABLE = 'PN_MANDATE_NOTACCEPTABLE',
  PN_MANDATE_DELEGATEHIMSELF = 'PN_MANDATE_DELEGATEHIMSELF',
  PN_MANDATE_INVALIDVERIFICATIONCODE = 'PN_MANDATE_INVALIDVERIFICATIONCODE',
  PN_GENERIC_INVALIDPARAMETER_PATTERN = 'PN_GENERIC_INVALIDPARAMETER_PATTERN',
  PN_USERATTRIBUTES_EXPIREDVERIFICATIONCODE = 'PN_USERATTRIBUTES_EXPIREDVERIFICATIONCODE',
  PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE = 'PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE',
  PN_USERATTRIBUTES_RETRYLIMITVERIFICATIONCODE = 'PN_USERATTRIBUTES_RETRYLIMITVERIFICATIONCODE',
  PN_DELIVERY_MANDATENOTFOUND = 'PN_DELIVERY_MANDATENOTFOUND',
  PN_INVALID_BODY = 'PN_INVALID_BODY',
  PN_DELIVERY_NOTIFICATIONNOTFOUND = 'PN_DELIVERY_NOTIFICATIONNOTFOUND',
  PN_DELIVERY_FILEINFONOTFOUND = 'PN_DELIVERY_FILEINFONOTFOUND',
  PN_DELIVERY_NOTIFICATIONWITHOUTPAYMENTATTACHMENT = 'PN_DELIVERY_NOTIFICATIONWITHOUTPAYMENTATTACHMENT',
  PN_DELIVERYPUSH_FILE_NOT_FOUND = 'PN_DELIVERYPUSH_FILE_NOT_FOUND'
  
  /**
   * The following codes have been reported here for completeness
   * but not yet used to generate a specific message.
   * Both BE documentation and text/copy availability are needed.
   */
  // PN_DELIVERY_NOTIFICATIONNOTFOUND = 'PN_DELIVERY_NOTIFICATIONNOTFOUND',
  // PN_DELIVERY_FILEINFONOTFOUND = 'PN_DELIVERY_FILEINFONOTFOUND',
  // PN_DELIVERY_NOTIFICATIONCOSTNOTFOUND = 'PN_DELIVERY_NOTIFICATIONCOSTNOTFOUND',
  // PN_DELIVERY_NOTIFICATIONWITHOUTPAYMENTATTACHMENT = 'PN_DELIVERY_NOTIFICATIONWITHOUTPAYMENTATTACHMENT',

  // PN_DELIVERYPUSH_NOTFOUND = 'PN_DELIVERYPUSH_NOTFOUND',
  // PN_DELIVERYPUSH_GETFILEERROR = 'PN_DELIVERYPUSH_GETFILEERROR',
  // PN_DELIVERYPUSH_UPLOADFILEERROR = 'PN_DELIVERYPUSH_UPLOADFILEERROR',
  // PN_DELIVERYPUSH_UPDATEMETAFILEERROR = 'PN_DELIVERYPUSH_UPDATEMETAFILEERROR',
  // PN_DELIVERYPUSH_ERRORCOMPUTECHECKSUM = 'PN_DELIVERYPUSH_ERRORCOMPUTECHECKSUM',
  // PN_DELIVERYPUSH_ATTACHMENTCHANGESTATUSFAILED = 'PN_DELIVERYPUSH_ATTACHMENTCHANGESTATUSFAILED',
  // PN_DELIVERYPUSH_INVALIDEVENTCODE = 'PN_DELIVERYPUSH_INVALIDEVENTCODE',
  // PN_DELIVERYPUSH_INVALIDATTEMPT = 'PN_DELIVERYPUSH_INVALIDATTEMPT',
  // PN_DELIVERYPUSH_INVALIDADDRESSSOURCE = 'PN_DELIVERYPUSH_INVALIDADDRESSSOURCE',
  // PN_DELIVERYPUSH_SENDDIGITALTIMELINEEVENTNOTFOUND = 'PN_DELIVERYPUSH_SENDDIGITALTIMELINEEVENTNOTFOUND',
  // PN_DELIVERYPUSH_DIGITALPROGRESSTIMELINEEVENTNOTFOUND = 'PN_DELIVERYPUSH_DIGITALPROGRESSTIMELINEEVENTNOTFOUND',
  // PN_DELIVERYPUSH_SCHEDULEDDIGITALTIMELINEEVENTNOTFOUND = 'PN_DELIVERYPUSH_SCHEDULEDDIGITALTIMELINEEVENTNOTFOUND',
  // PN_DELIVERYPUSH_LASTADDRESSATTEMPTNOTFOUND = 'PN_DELIVERYPUSH_LASTADDRESSATTEMPTNOTFOUND',
  // PN_DELIVERYPUSH_ERRORCOURTESY = 'PN_DELIVERYPUSH_ERRORCOURTESY',
  // PN_DELIVERYPUSH_ERRORCOURTESYIO = 'PN_DELIVERYPUSH_ERRORCOURTESYIO',

  // PN_WEBHOOK_UPDATEEVENTSTREAM = 'PN_WEBHOOK_UPDATEEVENTSTREAM',
  // PN_WEBHOOK_CONSUMEEVENTSTREAM = 'PN_WEBHOOK_CONSUMEEVENTSTREAM'
}
