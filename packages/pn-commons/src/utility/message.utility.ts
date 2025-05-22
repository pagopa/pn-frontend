/* eslint-disable functional/immutable-data */
import _ from 'lodash';

import { IAppMessage } from '../models';

export const createAppMessage = (
  title: string,
  message: string,
  showTechnicalData: boolean,
  status?: number,
  action?: string,
  traceId?: string,
  errorCode?: string
): IAppMessage => {
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
