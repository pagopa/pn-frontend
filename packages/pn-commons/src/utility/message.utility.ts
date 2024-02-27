/* eslint-disable functional/immutable-data */
import _ from 'lodash';

import { IAppMessage } from '../models';

export const createAppMessage = (
  title: string,
  message: string,
  status?: number,
  action?: string,
  retryAfter?: number
): IAppMessage => {
  const e: IAppMessage = {
    id: _.uniqueId(),
    title,
    message,
    blocking: false,
    toNotify: true,
    status,
    alreadyShown: false,
    action,
    retryAfter,
  };
  return e;
};
