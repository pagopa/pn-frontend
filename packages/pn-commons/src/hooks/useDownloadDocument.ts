import { useEffect } from 'react';

function downloadDocument(url: string) {
  /* eslint-disable functional/immutable-data */
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.click();
  /* eslint-enable functional/immutable-data */
};

type Props = {
  url?: string;
  clearDownloadAction?: () => any;
}
export function useDownloadDocument({ url, clearDownloadAction }: Props) {
  useEffect(() => {
    if (url) {
      downloadDocument(url);
      clearDownloadAction && clearDownloadAction();
    }
  }, [url, clearDownloadAction]);

  return null;
}
