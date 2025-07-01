/* eslint-disable functional/immutable-data */
import _ from 'lodash';

import { IAppMessage } from '../models';

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
    id: _.uniqueId(),
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
