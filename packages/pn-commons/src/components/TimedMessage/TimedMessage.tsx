import { Box } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

interface TimedMessageProps {
  /** Message to show */
  message?: ReactNode | string;
  /** Set timeout in milliseconds */
  timeout: number;
  /** Callback function when timeout reachs end */
  callback?: () => void;
}

const TimedMessage = ({ message = '', timeout = 0, callback }: TimedMessageProps) => {

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (timeout > 0) {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        if (typeof callback === 'function') {
          callback();
        }
      }, timeout);
    }
  }, [timeout]);

  return (
    <>
      {showMessage && (
        <Box data-testid="timed-message">
          { message }
        </Box>
      )}
    </>
  );
};

export default TimedMessage;
