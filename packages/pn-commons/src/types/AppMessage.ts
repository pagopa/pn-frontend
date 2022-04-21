export type IAppMessage = {
  /** The identifier used to recognize the error: it cannot be possible to have the same error id at the same time */
  id: string;
  /** If true, this error will show the error page, not allowing the user to do anything, otherwise it will show a closable popup */
  blocking: boolean;
  /** A description of the error to send when notifying the error */
  message: string;
  /** A text to show as title of the popup when a not blocking error occurs */
  title: string;
  /** If true, it will notify the error */
  toNotify: boolean;
  /** It represents message http status (if exist) */
  status?: number;
};
