import { AppResponse, ServerResponse } from '../../models/AppResponse';
import errorFactoryManager from '../AppError/ErrorFactoryManager';

export const createAppResponseError = (action: string, response: ServerResponse): AppResponse => {
  const factory = errorFactoryManager.factory;
  if (response) {
    const { data, status } = response;

    if (data) {
      const { traceId, timestamp, errors: serverErrors } = data;

      const retVal = { action, status, traceId, timestamp };

      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const errors = serverErrors?.map((error) => factory.create(error).getResponseError());
        return { ...retVal, errors };
      }

      const errors = status ? [factory.create(status).getResponseError()] : undefined;
      return { ...retVal, errors };
    }

    const errors = status ? [factory.create(status).getResponseError()] : undefined;
    return { action, errors };
  }

  return { action };
};

export const createAppResponseSuccess = (action: string, response: ServerResponse): AppResponse => {
  if (response) {
    const { status } = response;
    return {
      action,
      status,
    };
  }
  return { action };
};

export const createAppResponseInfo = (action: string, response: ServerResponse): AppResponse => {
  const retryAfter = response.retryAfter;

  if (retryAfter && retryAfter > 0) {
    console.log('----------------------nell if-------------------');
    console.log(retryAfter);
    console.log('-----------------------------------------');
    return {
      action,
      retryAfter,
    };
  }
  console.log('----------------------fuori if-------------------');
  console.log(retryAfter);
  console.log('-----------------------------------------');
  return { action };
};
