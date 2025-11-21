import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

enum DuplicatedParameter {
  PROTOCOL_NUMBER = 'Duplicated notification for senderPaId##paProtocolNumber##idempotenceToken',
  NOTICE_CODE = 'Duplicated notification for creditorTaxId##noticeCode',
}

interface ErrorTranslation {
  key: string;
  params?: Record<string, string>;
}

type TranslateFunction = (path: string, ns: string, params?: Record<string, string>) => string;

const extractNoticeCodeFromDetail = (detail: string): string | undefined => {
  const match = detail.match(/##noticeCode=\d+##(\d+)/);
  return match?.[1];
};

const getDuplicatedParameterErrorString = (error: string, detail?: string): ErrorTranslation => {
  switch (error) {
    case DuplicatedParameter.PROTOCOL_NUMBER:
      return { key: 'new-notification.errors.invalid_parameter_protocol_number_duplicate' };

    case DuplicatedParameter.NOTICE_CODE: {
      const noticeCode = detail ? extractNoticeCodeFromDetail(detail) : undefined;

      if (noticeCode) {
        return {
          key: 'new-notification.errors.invalid_parameter_notice_code_duplicate',
          params: { duplicatedNoticeCode: noticeCode },
        };
      }

      return { key: 'new-notification.errors.generic_invalid_parameter_notice_code_duplicate' };
    }

    default:
      return { key: 'new-notification.errors.invalid_parameter' };
  }
};

export class GenericInvalidParameterDuplicateAppError extends AppError {
  private translateFunction: TranslateFunction;

  constructor(error: ServerResponseError, translateFunction: TranslateFunction) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    const { key, params } = getDuplicatedParameterErrorString(this.element, this.detail);

    return {
      title: this.translateFunction(`${key}.title`, 'notifiche'),
      content: this.translateFunction(`${key}.message`, 'notifiche', params),
    };
  }
}
