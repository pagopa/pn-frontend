import { AppResponse, ServerResponse } from '../../types/AppResponse';
import errorFactoryManager from '../AppError/ErrorFactoryManager';

export const createAppResponseError = (action: string, response: ServerResponse): AppResponse => {
  const factory = errorFactoryManager.factory;
  if(response){
    const { data, status } = response;

    if(data) {
      const { traceId, timestamp, errors: serverErrors } = data;

      const retVal = { action, status, traceId, timestamp };
      
      if(Array.isArray(data.errors)) {
    
        const errors = serverErrors?.map((error) => factory.create(error).getResponseError());
    
        return { ...retVal, errors };
      } else {
        const errors = status ? [factory.create(status).getResponseError()] : undefined;
    
        return { ...retVal, errors };
      }
    } else {
      const errors = status ? [factory.create(status).getResponseError()] : undefined;
    
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
