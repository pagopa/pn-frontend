import { useEffect, useState } from 'react';

import { Box } from '@mui/material';

interface TimedMessageProps {
  /** Set timeout in milliseconds */
  timeout: number;
  /** Callback function when timeout reachs end */
  callback?: () => void;
}

const TimedMessage: React.FC<TimedMessageProps> = ({ timeout = 0, callback, children }) => {
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

  return <>{showMessage && <Box data-testid="timed-message">{children}</Box>}</>;
};

export default TimedMessage;
