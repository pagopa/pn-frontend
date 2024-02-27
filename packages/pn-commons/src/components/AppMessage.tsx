import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IAppMessage, MessageType } from '../models';
import { appStateActions, appStateSelectors } from '../redux';
import SnackBar from './SnackBar/SnackBar';

type EnqueuedMessage = {
  type: 'error' | 'success' | 'info';
  message: IAppMessage;
};

const AppMessage = () => {
  const dispatch = useDispatch();
  const errors = useSelector(appStateSelectors.selectErrors);
  const success = useSelector(appStateSelectors.selectSuccess);
  const info = useSelector(appStateSelectors.selectInfo);
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
    } else if (message.type === MessageType.SUCCESS) {
      dispatch(appStateActions.removeSuccess(message.message.id));
    }
    dispatch(appStateActions.removeInfo(message.message.id));

    setCurrentMessage(null);
  };

  const enqueueMessages = (messages: Array<IAppMessage>, type: 'success' | 'error' | 'info') => {
    const newQueue: Array<EnqueuedMessage> = messages
      .filter(
        (message: IAppMessage) =>
          // The messages keep in the appState Redux store slice until the same action is re-invoked.
          // Hence, the messages already shown, being shown, or already in the about-to-show queue,
          // musn't be added to the queue again
          // (those already or currently shown have entered and then left the queue)
          // ------------------------------
          // Carlos Lombardi, 2022.12.16
          // ------------------------------
          !message.alreadyShown &&
          message.id !== currentMessage?.message.id &&
          !isMessageEnqueued(message)
      )
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

  useEffect(() => {
    enqueueMessages(info, 'info');
  }, [info]);

  const getTypeOfMessage = (messageType: string | undefined) => {
    if (messageType === 'error') {
      return MessageType.ERROR;
    } else if (messageType === 'success') {
      return MessageType.SUCCESS;
    } else if (messageType === 'info') {
      return MessageType.INFO;
    } else {
      return MessageType.ERROR;
    }
  };

  const typeOfMessage = currentMessage?.type
    ? getTypeOfMessage(currentMessage.type)
    : MessageType.INFO;
  return (
    <>
      {currentMessage && (
        <SnackBar
          key={currentMessage.message.id}
          title={currentMessage.message.title}
          message={currentMessage.message.message}
          open
          type={typeOfMessage}
          onClose={() => onCloseToast(currentMessage)}
          closingDelay={5000}
        />
      )}
    </>
  );
};

export default AppMessage;
