export type IAppMessage = {
  /** The identifier used to recognize the error: it cannot be possible to have the same error id at the same time */
  id: string;
  /** If true, this error will show the error page, not allowing the user to do anything, otherwise it will show a closable popup */
  blocking: boolean;
  /** A description of the error to send when notifying the error */
  message: string;
  /** A text to show as title of the popup when a not blocking error occurs */
  title: string;
  /** If the message has technical data to be shown */
  showTechnicalData: boolean;
  /** It represents the traceId of the request which generated the error */
  traceId?: string;
  /** The taxonomy code of the error (if available) */
  errorCode?: string;
  /** If true, it will notify the error */
  toNotify: boolean;
  /** It represents message http status (if exist) */
  status?: number;
  /** The identifier of the rejected action that triggered this error */
  action?: string;
  /** Whether the error has been already shown.
   *  Errors must be kept after they have been shown because they signal failed Redux dispatchs (probably API calls),
   *  this information is used to decide whether to show the normal component showing the obtained data
   *  or else an ApiError component.
   */
  alreadyShown: boolean;
};
