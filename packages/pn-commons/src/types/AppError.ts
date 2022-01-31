import { ErrorInfo } from 'react';

export type AppError = {
  /** The identifier used to recognize the error: it cannot be possible to have the same error id at the same time */
  id: string;
  /** The Error thrown */
  error: Error;
  errorInfo?: ErrorInfo;
  /** If true, this error will show the error page, not allowing the user to do anything, otherwise it will show a closable popup */
  blocking: boolean;
  /** A description of the error to send when notifying the error */
  techDescription: string;
  /** A text to show as title of the popup when a not blocking error occurs */
  displayableTitle?: string;
  /** A text to show as body of the popup when a not blocking error occurs */
  displayableDescription?: string;
  /** If defined, in case of not blocking error, it will render a retry button which will execute this function */
  onRetry?: () => void;
  /** If defined, in case of not blocking error, it will be executed when closing the popup */
  onClose?: () => void;
  /** If true, it will notify the error */
  toNotify: boolean;
  /** Can render a SessionModal or Toast component */
  component?: 'SessionModal' | 'Toast';
};
