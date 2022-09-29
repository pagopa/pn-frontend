import { AppResponse, ServerResponse } from '../../types';
import { AppErrorFactory } from '../AppError';

export const createAppResponseError = (action: string, response: ServerResponse): AppResponse => {
  const data = response?.data;

  if(!data){
    return {
      action,
      status: response?.status || 0
    };
  }

  const { traceId, timestamp } = data;
  const resErrors = Array.isArray(data.errors) ? data.errors : [response.status];

  const errors = resErrors.map((error) => AppErrorFactory.create(error));

  return {
    action,
    status: response.status,
    traceId,
    timestamp,
    errors,
  };
};

export const createAppResponseSuccess = (action: string, response: ServerResponse): AppResponse => {
  const status = response?.status;
  return {
    action,
    status: status || 0
  };
};
