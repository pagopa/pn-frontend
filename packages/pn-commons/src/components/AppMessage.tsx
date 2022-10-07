import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { appStateActions, appStateSelectors } from '../redux';
import { IAppMessage, MessageType } from '../types';
import Toast from './Toast/Toast';

type EnqueuedMessage = {
  type: 'error' | 'success',
  message: IAppMessage
};

const AppMessage = () => {
  const dispatch = useDispatch();
  const errors = useSelector(appStateSelectors.selectErrors);
  const success = useSelector(appStateSelectors.selectSuccess);
  const [currentMessage, setCurrentMessage] = useState<EnqueuedMessage | null>(null);
  const [queue, setQueue] = useState<Array<EnqueuedMessage>>([]);
  // const [showMessage, setShowMessage] = useState(false);

  const onCloseToast = (message: EnqueuedMessage) => {
    if(message.type === MessageType.ERROR) {
      // dispatch(appStateActions.removeError(id));
      dispatch(appStateActions.setErrorAsAlreadyShown(message.message.id));
    }
    else {
      dispatch(appStateActions.removeSuccess(message.message.id));
    }

    setCurrentMessage(null);
  };

  useEffect(() => {
    if(!currentMessage && queue.length > 0) {
      setCurrentMessage(queue[0]);
      queue.shift();
      // setShowMessage(true);
    }
  }, [currentMessage, queue]);

  // useEffect(() => {
  //   setShowMessage(false);
  // },[showMessage]);

  useEffect(() => {
    const newErrors: Array<EnqueuedMessage> = errors.filter((message: IAppMessage) => !message.alreadyShown).map((message: IAppMessage) => ({
      type: 'error',
      message
    }));

    setQueue(() => queue.concat(newErrors));
  }, [errors]);

  useEffect(() => {
    const newSuccesses: Array<EnqueuedMessage> = success.filter((message: IAppMessage) => !message.alreadyShown).map((message: IAppMessage) => ({
      type: 'success',
      message
    }));
    
    setQueue(() => queue.concat(newSuccesses));
  }, [success]);

  return (
    <>
    {/* {(currentMessage && showMessage) && */}
    {currentMessage &&
      <Toast
      key={currentMessage.message.id}
      title={currentMessage.message.title || ""}
      message={currentMessage.message.message}
      open
      type={currentMessage.type === MessageType.ERROR ? MessageType.ERROR : MessageType.SUCCESS}
      onClose={() => onCloseToast(currentMessage)}
      closingDelay={5000}
    />}
    </>
  );
};

export default AppMessage;
