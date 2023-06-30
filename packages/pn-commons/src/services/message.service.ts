/* eslint-disable functional/immutable-data */
import _ from 'lodash';

import { IAppMessage } from '../types';

export const createAppMessage = (title: string, message: string, status?: number, action?: string): IAppMessage => {
  const e: IAppMessage = {
    id: _.uniqueId(),
    title,
    message,
    blocking: false,
    toNotify: true,
    status,
    alreadyShown: false,
    action
  };
  return e;
};
