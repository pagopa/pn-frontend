import { AppErrorDetail, AppErrorTypes, ErrorMessage } from '../../types/AppError';

export abstract class AppError {
  protected abstract type: AppErrorTypes;
  
  protected detail: AppErrorDetail;

  constructor(error: AppErrorDetail) {
    this.detail = error;
  }

  getErrorDetail(): {type: string, detail: AppErrorDetail} {
    return {
      type: this.type,
      detail: this.detail
    }
  }

  abstract getMessage(): ErrorMessage;
}
