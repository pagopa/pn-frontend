import { AppResponse, ServerResponse } from "../../types/AppError";
import AppErrorFactory from "./AppErrorFactory";
import GenericAppErrorFactory from "./GenericAppError/GenericAppErrorFactory";

const createAppResponse = (response: ServerResponse): AppResponse => {
  if(response.data?.errors && Array(response.data?.errors).length > 0) {
    const { traceId, timestamp } = response.data;
    const errors = response.data.errors.map(error => AppErrorFactory.create(error));
    return {
      status: response.status,
      traceId,
      timestamp,
      errors
    };
  } else {
    const error = GenericAppErrorFactory.create(response.status);
    return {
      status: response.status,
      errors: [ error ]
    };
  }
};

export default createAppResponse;