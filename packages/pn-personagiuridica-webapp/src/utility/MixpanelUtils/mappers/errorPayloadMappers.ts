import type { PGToastErrorPayload, ToastErrorEventData } from '../../../models/PGEventPayloads';

export const mapToastErrorToEventPayload = ({
  error,
  response,
  pageName,
}: ToastErrorEventData): PGToastErrorPayload => {
  const { traceId, status, action } = response;

  return {
    reason: error.code,
    traceid: traceId,
    page_name: pageName,
    action,
    httpStatusCode: status,
    message: error.message.content,
  };
};
