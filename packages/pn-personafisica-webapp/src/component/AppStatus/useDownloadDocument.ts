import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { clearLegalFactDocumentData } from '../../redux/appStatus/reducers';

function downloadDocument(url: string) {
  /* eslint-disable functional/immutable-data */
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.click();
  /* eslint-enable functional/immutable-data */
};

export function useDownloadDocument() {
  const dispatch = useAppDispatch();
  const legalFactDocumentDetails = useAppSelector((state: RootState) => state.appStatus.legalFactDocumentData);

  useEffect(() => {
    if (legalFactDocumentDetails && legalFactDocumentDetails.url) {
      downloadDocument(legalFactDocumentDetails.url);
      dispatch(clearLegalFactDocumentData());
    }
  }, [legalFactDocumentDetails]);

  return null;
}
