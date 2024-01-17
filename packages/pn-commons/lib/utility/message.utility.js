/* eslint-disable functional/immutable-data */
import _ from 'lodash';
export const createAppMessage = (title, message, status, action) => {
    const e = {
        id: _.uniqueId(),
        title,
        message,
        blocking: false,
        toNotify: true,
        status,
        alreadyShown: false,
        action,
    };
    return e;
};
