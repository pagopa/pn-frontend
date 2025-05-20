/* eslint-disable functional/immutable-data */
import _ from 'lodash';

import { IAppMessage } from '../models';

export const createAppMessage = (
  title: string,
  message: string,
  permanent: boolean,
  status?: number,
  action?: string
): IAppMessage => {
  const e: IAppMessage = {
    id: _.uniqueId(),
    title,
    message,
    permanent,
    blocking: false,
    toNotify: true,
    status,
    alreadyShown: false,
    action,
  };
  return e;
};
