import { AppResponse, ServerResponse } from '../../types';
import { AppErrorFactory } from '../AppError';

export const createAppResponseError = (action: string, response: ServerResponse): AppResponse => {
  if(response){
    const { data, status } = response;

    if(data) {
      const { traceId, timestamp, errors: serverErrors } = data;

      const retVal = { action, status, traceId, timestamp };
      
      if(Array.isArray(data.errors)) {
    
        const errors = serverErrors?.map((error) => AppErrorFactory.create(error).getResponseError());
    
        return { ...retVal, errors };
      } else {
        const errors = status ? [AppErrorFactory.create(status).getResponseError()] : undefined;
    
        return { ...retVal, errors };
      }
    } else {
      const errors = status ? [AppErrorFactory.create(status).getResponseError()] : undefined;
    
      return { action, errors };
    }
  } else {
    return { action };
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
