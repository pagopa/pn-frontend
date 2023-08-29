import { useEffect } from 'react';

function downloadDocument(url: string, isMobile?: boolean) {
  const link = document.createElement('a');
  link.href = url;
  if (!isMobile) {
    link.target = '_blank';
  }
  link.rel = 'noreferrer';
  link.click();
}

type Props = {
  url?: string;
  isMobile?: boolean;
  clearDownloadAction?: () => void;
};

// There are no tests for this hook, since for such a test either the document
// or the downloadDocument action.
// For the former, jest offers no simple way to do it.
// For the latter, we were adding a parameter just for testing.
// Hence the decision of not producing tests of this hook
// -------------------------------
// Carlos Lombardi and Andrea Cimini, 2022.11.17
// -------------------------------
export function useDownloadDocument({ url, isMobile, clearDownloadAction }: Props) {
  useEffect(() => {
    if (url) {
      downloadDocument(url, isMobile);
      clearDownloadAction && clearDownloadAction();
    }
  }, [url, clearDownloadAction]);

  return null;
}
