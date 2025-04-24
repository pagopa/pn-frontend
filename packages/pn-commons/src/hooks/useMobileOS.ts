import { useEffect, useState } from 'react';

export const useMobileOS = (): 'iOS' | 'Android' | 'Unknown' => {
  const [os, setOS] = useState<'iOS' | 'Android' | 'Unknown'>('Unknown');

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
      setOS('Android');
    } else if (/iPad|iPhone|iPod|Macintosh/.test(userAgent)) {
      setOS('iOS');
    } else {
      setOS('Unknown');
    }
  }, []);

  return os;
};
