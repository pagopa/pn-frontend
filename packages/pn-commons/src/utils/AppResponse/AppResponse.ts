import { AppResponse, ServerResponse } from '../../types';
import { AppErrorFactory } from '../AppError';

export const createAppResponseError = (action: string, response: ServerResponse): AppResponse => {
  const { data, status } = response;

  if(data) {
    const { traceId, timestamp, errors: serverErrors } = data;

    const retVal = { action, status, traceId, timestamp };
    
    if(Array.isArray(data.errors)) {
  
      const errors = serverErrors?.map((error) => AppErrorFactory.create(error));
  
      return { ...retVal, errors };
    } else {
      const errors = status ? [AppErrorFactory.create(status)] : undefined;
  
      return { ...retVal, errors };
    }
  } else {
    const errors = status ? [AppErrorFactory.create(status)] : undefined;
  
    return { action, errors };
  }
};

export const createAppResponseSuccess = (action: string, response: ServerResponse): AppResponse => {
  if(response) {
    const { status } = response;
    return {
      action,
      status
    };
  }
  return { action };
};
