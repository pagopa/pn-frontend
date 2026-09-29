/**
 * Tells whether the app is running on a mobile device.
 * iPadOS Safari reports a Macintosh user agent, so it is told apart from a desktop Mac
 * by the presence of multiple touch points.
 */
export const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor;
  const isIpadOS = /Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1;

  return /Android|iPhone|iPad|iPod/i.test(userAgent) || isIpadOS;
};
