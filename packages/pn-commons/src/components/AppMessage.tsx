import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { appStateActions, appStateSelectors } from '../redux';
import { IAppMessage, MessageType } from '../types';
import SnackBar from './SnackBar/SnackBar';
//import Toast from './Toast/Toast';

type EnqueuedMessage = {
  type: 'error' | 'success';
  message: IAppMessage;
};

const AppMessage = () => {
  const dispatch = useDispatch();
  const errors = useSelector(appStateSelectors.selectErrors);
  const success = useSelector(appStateSelectors.selectSuccess);
  const [currentMessage, setCurrentMessage] = useState<EnqueuedMessage | null>(null);
  const [queue, setQueue] = useState<Array<EnqueuedMessage>>([]);

  const isMessageEnqueued = (message: IAppMessage): boolean =>
    queue.findIndex((elem) => elem.message.id === message.id) >= 0 ? true : false;

  const onCloseToast = (message: EnqueuedMessage) => {
    if (message.type === MessageType.ERROR) {
      /**
       * keep "alreadyShown" property on IAppMessage to ensure back-compatibility with ApiErrorWrapper Component
       * this property can be removed and ApiErrorWrapper refactored to take advantage of the pub/sub mechanism
       */
      // dispatch(appStateActions.removeError(id));
      dispatch(appStateActions.setErrorAsAlreadyShown(message.message.id));
    } else {
      dispatch(appStateActions.removeSuccess(message.message.id));
    }

    setCurrentMessage(null);
  };

  const enqueueMessages = (messages: Array<IAppMessage>, type: 'success' | 'error') => {
    const newQueue: Array<EnqueuedMessage> = messages
      .filter((message: IAppMessage) => !message.alreadyShown && !isMessageEnqueued(message))
      .map((message: IAppMessage) => ({
        type,
        message,
      }));

    setQueue((currentValue) => currentValue.concat(newQueue));
  };

  useEffect(() => {
    if (!currentMessage && queue.length > 0) {
      setCurrentMessage(queue[0]);
      setQueue((currentValue) => currentValue.slice(1));
    }
  }, [currentMessage, queue]);

  useEffect(() => {
    enqueueMessages(errors, 'error');
  }, [errors]);

  useEffect(() => {
    enqueueMessages(success, 'success');
  }, [success]);

  return (
    <>
      {/* currentMessage &&
      <Toast
      key={currentMessage.message.id}
      title={currentMessage.message.title || ""}
      message={currentMessage.message.message}
      open
      type={currentMessage.type === MessageType.ERROR ? MessageType.ERROR : MessageType.SUCCESS}
      onClose={() => onCloseToast(currentMessage)}
      closingDelay={5000}
    /> */}
      {currentMessage && (
        <SnackBar
          key={currentMessage.message.id}
          title={currentMessage.message.title || ''}
          message={currentMessage.message.message}
          open
          type={currentMessage.type === MessageType.ERROR ? MessageType.ERROR : MessageType.SUCCESS}
          onClose={() => onCloseToast(currentMessage)}
          closingDelay={5000}
        />
      )}
    </>
  );
};

export default AppMessage;
