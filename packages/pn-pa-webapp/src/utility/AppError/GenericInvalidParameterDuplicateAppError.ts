import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

enum DuplicatedParameter {
  PROTOCOL_NUMBER = 'Duplicated notification for senderPaId##paProtocolNumber##idempotenceToken',
  NOTICE_CODE = 'Duplicated notification for creditorTaxId##noticeCode',
}

const getDuplicatedParameterErrorString = (error: string) => {
  switch (error) {
    case DuplicatedParameter.PROTOCOL_NUMBER:
      return 'new-notification.errors.invalid_parameter_protocol_number_duplicate';
    case DuplicatedParameter.NOTICE_CODE:
      return 'new-notification.errors.invalid_parameter_notice_code_duplicate';
    default:
      return 'new-notification.errors.invalid_parameter';
  }
};

export class GenericInvalidParameterDuplicateAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    const duplicatedParameterErrorString = getDuplicatedParameterErrorString(this.element);
    return {
      title: this.translateFunction(`${duplicatedParameterErrorString}.title`, 'notifiche'),
      content: this.translateFunction(`${duplicatedParameterErrorString}.message`, 'notifiche'),
    };
  }
}
