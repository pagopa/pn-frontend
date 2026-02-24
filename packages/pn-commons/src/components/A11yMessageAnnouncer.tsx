import { useEffect, useRef } from 'react';

import { Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import { useEventEmitter } from '../hooks';

export interface A11yMessage {
  message: string;
}

const SUFFIXES = ['\u200B', '\u200C'];

const A11yMessageAnnouncer: React.FC = () => {
  const { eventData } = useEventEmitter<A11yMessage>('a11y-message');
  // The suffix forces a DOM text change using invisible characters so that
  // screen readers will re-announce even if the visible text is identical.
  // Store previous message and suffix to check if something is changed.
  const prevMessage = useRef<string>();
  const prevSuffix = useRef<string>();

  const message = eventData?.message;
  // If current message is equal to previous message we have to change the suffix to simulate a different text.
  const suffix =
    prevMessage.current === message
      ? SUFFIXES.find((suff) => suff !== prevSuffix.current)
      : SUFFIXES[0];
  const messageToAnnounce = `${message}${suffix}`;

  useEffect(() => {
    if (!eventData?.message) {
      return;
    }
    // eslint-disable-next-line functional/immutable-data
    prevMessage.current = eventData?.message;
    // eslint-disable-next-line functional/immutable-data
    prevSuffix.current = suffix;
  }, [eventData]);

  if (!message) {
    return;
  }

  return (
    <>
      {/* Hidden live region: only for screen readers, used to announce meaningful messages */}
      <Box role="status" aria-live="polite" aria-atomic="true" sx={{ ...visuallyHidden }}>
        {messageToAnnounce}
      </Box>
    </>
  );
};

export default A11yMessageAnnouncer;
