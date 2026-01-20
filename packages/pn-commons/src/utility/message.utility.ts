/* eslint-disable functional/immutable-data */
import { uniqueId } from 'lodash-es';

import { IAppMessage } from '../models/AppMessage';

export type CreateAppMessageParams = Pick<
  IAppMessage,
  'title' | 'message' | 'showTechnicalData' | 'status' | 'action' | 'traceId' | 'errorCode'
>;

export const createAppMessage = ({
  title,
  message,
  showTechnicalData,
  status,
  action,
  traceId,
  errorCode,
}: CreateAppMessageParams): IAppMessage => {
  const e: IAppMessage = {
    id: uniqueId(),
    title,
    message,
    showTechnicalData,
    traceId,
    errorCode,
    blocking: false,
    toNotify: true,
    status,
    alreadyShown: false,
    action,
  };
  return e;
};
