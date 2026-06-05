import type { PAToastErrorPayload, ToastErrorEventData } from '../../../models/PAEventPayloads';

export const mapToastErrorToEventPayload = ({
  error,
  response,
  pageName,
}: ToastErrorEventData): PAToastErrorPayload => {
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
