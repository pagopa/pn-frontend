import { Box, Typography, TypographyTypeMap } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

interface TimedMessageProps {
  /** Message to show */
  message?: ReactNode | string;
  /** Set timeout in milliseconds */
  timeout: number;
  /** Variant typography style */
  variant?: TypographyTypeMap["props"]["variant"];
  /** Callback function when timeout reachs end */
  callback?: () => void;
}

const TimedMessage = ({ message = '', timeout = 0, variant, callback }: TimedMessageProps) => {

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
        <Box>
          <Typography variant={variant} data-testid="timed-message">
            { message }
          </Typography>
        </Box>
      )}
    </>
  );
};

export default TimedMessage;
